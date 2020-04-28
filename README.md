# Deploy automatizado de cluster GKE para ambiente de desarrollo efimero.

## PRE-REQUISITOS

1. debes tener instalado y configurado gcloud y autenticarte utilizando el comando
```shell
gcloud auth login
```
2. debes tener instalado node.js, puedes encontrarlo [AQUI](https://nodejs.org/es/)

3. debes tener instalado el CLI de  [Pulumi](curl -fsSL https://get.pulumi.com | sh)

4. configura un stack de pulumi y añade estas variables:
```
gcp:project: webicluster
gcp:region: us-central1
gcp:zone: us-central1
```

## USO

1. clona este repositorio
2. corre `npm install`
3. corre `pulumi up`

una vez que finaliza la instalacion, debes obtener los contenidos de la kubeconfig y crear un archivo
```shell
pulumi stack output configFile > gke-kubeconfig
```

con ese archivo puede configurar distintas herrmientas para manejar tu cluster!