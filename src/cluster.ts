import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import { subnet, vpc } from './network';

// obten la ultima version disponible para los nodos
const latestGkeVersion = gcp.container.getEngineVersions().latestMasterVersion; // 1.18
// Crea el cluster de GKE
export const cluster = new gcp.container.Cluster(
  'webicluster',
  {
    initialNodeCount: 2,
    location: 'us-central1-a',
    network: vpc.name,
    subnetwork: subnet.name,
    minMasterVersion: latestGkeVersion,
    nodeVersion: latestGkeVersion,
    nodeConfig: {
      machineType: 'n1-standard-1',
      oauthScopes: [
        'https://www.googleapis.com/auth/compute',
        'https://www.googleapis.com/auth/devstorage.read_only',
        'https://www.googleapis.com/auth/logging.write',
        'https://www.googleapis.com/auth/monitoring',
      ],
    },
  },
  {
    dependsOn: [subnet, vpc], // <
  },
);

// crea un archivo kubeconfig estilo GKE-style. esto es un poco diferente a la
// forma convencional de los kubeconfig porque GKE requiere autenticacion con gcloud
export const kubeconfig = pulumi
  .all([cluster.name, cluster.endpoint, cluster.masterAuth])
  .apply(([name, endpoint, masterAuth]) => {
    const context = `${gcp.config.project}_${gcp.config.zone}_${name}`;
    return `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${masterAuth.clusterCaCertificate}
    server: https://${endpoint}
  name: ${context}
contexts:
- context:
    cluster: ${context}
    user: ${context}
  name: ${context}
current-context: ${context}
kind: Config
preferences: {}
users:
- name: ${context}
  user:
    auth-provider:
      config:
        cmd-args: config config-helper --format=json
        cmd-path: gcloud
        expiry-key: '{.credential.token_expiry}'
        token-key: '{.credential.access_token}'
      name: gcp
`;
  });

// Create un proveedor de Kubernetes y exportalo con el kubeconfig para extender esta automatizacion
export const clusterProvider = new k8s.Provider('webicluster', { kubeconfig });
