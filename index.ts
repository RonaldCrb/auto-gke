
import {
  cluster,
  kubeconfig,
  clusterProvider
} from "./src/cluster";

import { vpc, subnet } from "./src/network";

// el estatus de tu cluster
export const clusterOutput = {
  cluster: cluster ? "cluster is up" : "ERROR with the cluster",
  provider: clusterProvider ? "provider is up" : "ERROR with the clusterProvider",
}

// la kubeconfig
export const configFile = kubeconfig

// la red y subred donde estan los nodos de este cluster
export const networkOutput = {
  vpc: vpc ? "vpc master-gke is up" : "ERROR with the vpc",
  subnet: subnet ? "subnet external is up" : "ERROR with the subnet"
}
