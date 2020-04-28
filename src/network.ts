import * as gcp from '@pulumi/gcp';

// crea una red GCP
export const vpc = new gcp.compute.Network('miRed', {
  name: 'miRed',
  project: 'miProyecto',
  autoCreateSubnetworks: false,
});

// crea una subred dentro de la red previamente creada
export const subnet = new gcp.compute.Subnetwork(
  'miSubRed',
  {
    name: 'miSubRed',
    project: 'miProyecto',
    network: vpc.selfLink,
    ipCidrRange: '10.20.30.0/24',
  },
  {
    dependsOn: vpc,
    parent: vpc,
  },
);
