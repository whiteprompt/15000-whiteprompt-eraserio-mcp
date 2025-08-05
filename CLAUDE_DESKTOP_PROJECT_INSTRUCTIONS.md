# Eraser.io Diagram Syntax Guide for LLMs

## 1. Flow Chart Syntax

### Nodes
- **Basic syntax**: `NodeName` or `NodeName [properties]`
- Node names must be unique
- Nodes are automatically created when referenced in connections

**Example:**
```
Start [shape: oval]
Process
End [shape: oval, color: red]
```

### Groups
- **Syntax**: `GroupName { content }`
- Groups can contain nodes and other groups
- Group names must be unique

**Example:**
```
Loop {
  Issue1
  Issue2
  Issue3
}

Outer Loop {
  Inner Loop {
    Task1
    Task2
  }
  Task3
}
```

### Node and Group Properties
| Property | Description | Values | Default |
|----------|-------------|---------|---------|
| shape | Node shape | rectangle, cylinder, diamond, document, ellipse, hexagon, oval, parallelogram, star, trapezoid, triangle | rectangle |
| icon | Icon name | aws-ec2, user, database, etc. | - |
| color | Stroke and fill color | Color name or hex code (in quotes) | - |
| label | Display text | Any string (use quotes if spaces) | Node/group name |
| colorMode | Fill lightness | pastel, bold, outline | pastel |
| styleMode | Visual style | shadow, plain, watercolor | shadow |
| typeface | Text style | rough, clean, mono | rough |

### Connections
**Connection types:**
- `>` : Left-to-right arrow
- `<` : Right-to-left arrow
- `<>` : Bi-directional arrow
- `-` : Line
- `--` : Dotted line
- `-->` : Dotted arrow

**Connection features:**
- Labels: `Node1 > Node2: Label text`
- Branching: `Node1 > Node2, Node3, Node4`
- Chaining: `Node1 > Node2 > Node3`
- Properties: `Node1 > Node2 [color: green]`

### Direction Control
```
direction down    # default
direction up
direction right
direction left
```

### Diagram-level Styling
```
colorMode bold
styleMode shadow
typeface clean
```

## 2. Entity Relationship Diagram (ERD) Syntax

### Entities
- **Syntax**: `entityName { attributes }`
- Entity names must be unique

**Example:**
```
users {
  id string pk
  displayName string
  email string
}

teams { }  # Empty entity
```

### Attributes
- **Syntax within entity**: `attributeName type metadata`
- **Reference syntax**: `entityName.attributeName`
- Types and metadata are optional

**Example:**
```
users {
  id string pk
  teamId uuid fk
  createdAt timestamp
}
```

### Entity Properties
| Property | Description | Values | Default |
|----------|-------------|---------|---------|
| icon | Attached icon | Icon names | - |
| color | Stroke and fill color | Color name or hex code | - |
| colorMode | Fill lightness | pastel, bold, outline | pastel |
| styleMode | Visual style | shadow, plain, watercolor | shadow |
| typeface | Text style | rough, clean, mono | rough |

**Example:**
```
users [icon: user, color: blue] {
  id string pk
}
```

### Relationships
**Relationship types:**
- `<` : One-to-many
- `>` : Many-to-one
- `-` : One-to-one
- `<>` : Many-to-many

**Relationship syntax:**
- Attribute level: `users.teamId > teams.id`
- Entity level: `users > teams`
- Inline definition: Inside entity, use `teamId < teams.id`
- Properties: `users.teamId > teams.id [color: green]`

### ERD-specific Styling
```
notation chen        # or crows-feet (default: chen)
colorMode bold
styleMode shadow
typeface clean
```

## 3. Cloud Architecture Diagram Syntax

### Nodes
- **Syntax**: `nodeName [icon: iconName]`
- Node names must be unique
- Icons are typically required for cloud diagrams

**Example:**
```
compute [icon: aws-ec2]
storage [icon: aws-s3]
database [icon: aws-rds]
```

### Groups
- **Syntax**: `GroupName { nodes }`
- Groups represent logical boundaries (VPCs, subnets, etc.)
- Can be nested

**Example:**
```
VPC Subnet {
  Main Server {
    Server [icon: aws-ec2]
    Data [icon: aws-rds]
  }
  Load Balancer [icon: aws-elb]
}
```

### Properties
| Property | Description | Values | Default |
|----------|-------------|---------|---------|
| icon | Service icon | aws-*, gcp-*, azure-*, etc. | - |
| color | Color | Color name or hex (in quotes) | - |
| label | Display text | Any string (quotes if spaces) | Node/group name |
| colorMode | Fill lightness | pastel, bold, outline | pastel |
| styleMode | Visual style | shadow, plain, watercolor | shadow |
| typeface | Text style | rough, clean, mono | rough |

### Connections
Same as flow charts:
- `>`, `<`, `<>`, `-`, `--`, `-->`
- Labels: `Storage > Server: Cache Hit`
- One-to-many: `Server > Worker1, Worker2, Worker3`
- Properties: `Storage > Server [color: green]`

### Direction Control
```
direction right    # default for cloud diagrams
direction down
direction up
direction left
```

## 4. Sequence Diagram Syntax

### Basic Message Syntax
`Column1 > Column2: Message text`

**Example:**
```
Web App > DB: Start transaction
DB > Web App: Transaction ID
```

### Columns
- Column names must be unique
- Columns are created automatically when first referenced
- Properties can be added inline

**Example:**
```
Web App [icon: monitor, color: blue] > DB [icon: database]: Query
```

### Arrow Types
- `>` : Solid arrow (left-to-right)
- `<` : Solid arrow (right-to-left)
- `<>` : Bi-directional arrow
- `-` : Solid line
- `--` : Dotted line
- `-->` : Dotted arrow

### Column Properties
| Property | Description | Values | Default |
|----------|-------------|---------|---------|
| icon | Column icon | Icon names | - |
| color | Color | Color name or hex | - |
| label | Display text | Any string | Column name |
| colorMode | Fill lightness | pastel, bold, outline | pastel |
| styleMode | Visual style | shadow, plain, watercolor | shadow |
| typeface | Text style | rough, clean, mono | rough |

### Control Flow Blocks
**Block types:**
- `loop`: Iteration
- `alt`/`else`: Alternative paths
- `opt`: Optional execution
- `par`/`and`: Parallel execution
- `break`: Break execution

**Syntax:**
```
loop [label: Process items] {
  Client > Server: Process item
  Server > Client: Result
}

alt [label: if success] {
  Server > Client: Success response
}
else [label: if error] {
  Server > Client: Error response
}

par [label: concurrent] {
  Server > DB: Query 1
}
and {
  Server > Cache: Query 2
}
```

### Block Properties
| Property | Description | Values |
|----------|-------------|---------|
| label | Block label | Any string |
| icon | Label icon | Icon names |
| color | Block color | Color name or hex |

### Activations
Show when a column is actively processing:
```
Client > Server: Request
activate Server
Server > DB: Query
DB > Server: Result
Server > Client: Response
deactivate Server
```

### Sequence-specific Styling
```
autoNumber on      # on, nested, or off (default: off)
colorMode bold
styleMode shadow
typeface clean
```

## Common Features Across All Diagram Types

### Escaping Special Characters
Wrap names in quotes to use reserved characters:
```
"CI/CD Pipeline" [icon: gear]
User > "https://localhost:8080": GET request
"Node/Group" > "Special:Name"
```

### Color Specifications
- Named colors: `red`, `blue`, `green`, etc.
- Hex codes: Must be in quotes, e.g., `"#FF5733"`

### Icon Names
Icons are available from various providers:

#### AWS Icons (348 icons)
**Note:** All AWS icons require the `aws-` prefix when used in diagrams (e.g., `[icon: aws-ec2]`).

`athena`, `cloudsearch`, `emr`, `finspace`, `kinesis`, `kinesis-data-analytics`, `kinesis-data-streams`, `kinesis-firehose`, `kinesis-video-streams`, `managed-streaming-for-apache-kafka`, `opensearch-service`, `quicksight`, `redshift`, `data-exchange`, `data-pipeline`, `glue`, `glue-databrew`, `glue-elastic-views`, `lake-formation`, `api-gateway`, `appflow`, `eventbridge`, `managed-workflows-for-apache-airflow`, `mq`, `simple-notification-service`, `simple-queue-service`, `appsync`, `console-mobile-application`, `express-workflows`, `step-functions`, `managed-blockchain`, `quantum-ledger-database`, `alexa-for-business`, `chime`, `chime-sdk`, `chime-voice-connector`, `connect`, `honeycode`, `pinpoint`, `pinpoint-apis`, `simple-email-service`, `workdocs`, `workdocs-sdk`, `workmail`, `application-cost-profiler`, `billing-conductor`, `budgets`, `cost-and-usage-report`, `cost-explorer`, `reserved-instance-reporting`, `savings-plans`, `ec2`, `ec2-auto-scaling`, `ec2-image-builder`, `ec2-m5n`, `ec2-r5n`, `elastic-container-kubernetes`, `elastic-container-registry`, `elastic-container-service`, `genomics-cli`, `lightsail`, `app-runner`, `batch`, `compute-optimizer`, `elastic-beanstalk`, `fargate`, `lambda`, `local-zones`, `nitro-enclaves`, `outposts-family`, `outposts-rack`, `outposts-servers`, `parallelcluster`, `serverless-application-repository`, `thinkbox-deadline`, `thinkbox-frost`, `thinkbox-krakatoa`, `thinkbox-sequoia`, `thinkbox-stoke`, `thinkbox-xmesh`, `wavelength`, `bottlerocket`, `elastic-fabric-adapter`, `nice-dcv`, `nice-enginframe`, `vmware-cloud-on-aws`, `ecs-anywhere`, `eks-anywhere`, `eks-cloud`, `eks-distro`, `elastic-kubernetes-service`, `red-hat-openshift`, `activate`, `iq`, `managed-services`, `professional-services`, `repost`, `support`, `training-certification`, `aurora`, `documentdb`, `dynamodb`, `elasticache`, `keyspaces`, `memorydb-for-redis`, `neptune`, `rds`, `rds-on-vmware`, `timestream`, `database-migration-service`, `corretto`, `cloud-control-api`, `cloud-development-kit`, `cloud9`, `cloudshell`, `codeartifact`, `codebuild`, `codecommit`, `codedeploy`, `codepipeline`, `codestar`, `command-line-interface`, `tools-and-sdks`, `x-ray`, `appstream`, `worklink`, `workspaces`, `workspaces-web`, `location-service`, `amplify`, `device-farm`, `gamelift`, `gamesparks`, `gamekit`, `open-3d-engine`, `marketplace`, `iot-1-click`, `iot-analytics`, `iot-button`, `iot-core`, `iot-device-defender`, `iot-device-management`, `iot-edukit`, `iot-events`, `iot-expresslink`, `iot-fleetwise`, `iot-greengrass`, `iot-roborunner`, `iot-sitewise`, `iot-things-graph`, `iot-twinmaker`, `freertos`, `augmented-ai-a2i`, `codeguru`, `codewhisperer`, `comprehend`, `comprehend-medical`, `devops-guru`, `elastic-inference`, `forecast`, `fraud-detector`, `healthlake`, `kendra`, `lex`, `lookout-for-equipment`, `lookout-for-metrics`, `lookout-for-vision`, `monitron`, `personalize`, `polly`, `rekognition`, `sagemaker`, `sagemaker-ground-truth`, `sagemaker-studio-lab`, `textract`, `transcribe`, `translate`, `apache-mxnet-on-aws`, `deep-learning-amis`, `deep-learning-containers`, `deepcomposer`, `deeplens`, `deepracer`, `neuron`, `panorama`, `tensorflow-on-aws`, `torchserve`, `cloudwatch`, `managed-grafana`, `managed-service-for-prometheus`, `appconfig`, `application-auto-scaling`, `auto-scaling`, `backint-agent`, `chatbot`, `cloudformation`, `cloudtrail`, `config`, `control-tower`, `distro-for-opentelemetry`, `fault-injection-simulator`, `launch-wizard`, `license-manager`, `management-console`, `opsworks`, `organizations`, `personal-health-dashboard`, `proton`, `resilience-hub`, `service-catalog`, `systems-manager`, `systems-manager-incident-manager`, `trusted-advisor`, `well-architected-tool`, `elastic-transcoder`, `interactive-video-service`, `nimble-studio`, `elemental-appliances-&-software`, `elemental-conductor`, `elemental-delta`, `elemental-link`, `elemental-live`, `elemental-mediaconnect`, `elemental-mediaconvert`, `elemental-medialive`, `elemental-mediapackage`, `elemental-mediastore`, `elemental-mediatailor`, `elemental-server`, `application-discovery-service`, `application-migration-service`, `datasync`, `mainframe-modernization`, `migration-evaluator`, `migration-hub`, `server-migration-service`, `transfer-family`, `cloud-directory`, `cloudfront`, `route-53`, `vpc`, `app-mesh`, `client-vpn`, `cloud-map`, `cloud-wan`, `direct-connect`, `global-accelerator`, `private-5g`, `privatelink`, `site-to-site-vpn`, `transit-gateway`, `elastic-load-balancing`, `braket`, `robomaker`, `ground-station`, `cognito`, `detective`, `guardduty`, `inspector`, `macie`, `artifact`, `audit-manager`, `certificate-manager`, `cloudhsm`, `directory-service`, `firewall-manager`, `iam-identity-center`, `identity-and-access-management`, `key-management-service`, `network-firewall`, `resource-access-manager`, `secrets-manager`, `security-hub`, `shield`, `signer`, `waf`, `efs`, `elastic-block-store`, `fsx`, `fsx-for-lustre`, `fsx-for-netapp-ontap`, `fsx-for-openzfs`, `fsx-for-wfs`, `s3-on-outposts`, `simple-storage-service`, `simple-storage-service-glacier`, `backup`, `snowball`, `snowball-edge`, `snowcone`, `snowmobile`, `storage-gateway`, `cloudendure-disaster-recovery`, `sumerian`, `analytics`, `application-integration`, `blockchain`, `business-applications`, `cloud-financial-management`, `compute`, `containers`, `customer-enablement`, `database`, `developer-tools`, `end-user-computing`, `front-end-web-mobile`, `game-tech`, `internet-of-things`, `machine-learning`, `management-governance`, `media-services`, `migration-transfer`, `networking-content-delivery`, `quantum-technologies`, `robotics`, `satellite`, `security-identity-compliance`, `serverless`, `storage`, `vr-ar`, `migration-modernization`, `artificial-intelligence`, `contact-center`, `games`, `app-mesh-virtual-node`, `app-mesh-virtual-router`, `app-mesh-virtual-service`, `cloud-map-namespace`, `cloud-map-resource`, `cloud-map-service`, `cloud-wan-core-network-edge`, `cloud-wan-segment-network`, `cloud-wan-transit-gateway-route-table-attachment`, `cloud-wan-virtual-pop`, `cloudfront-download-distribution`, `cloudfront-edge-location`, `cloudfront-functions_48_Light`, `cloudfront-streaming-distribution`, `direct-connect-gateway`, `elb-application-load-balancer`, `elb-classic-load-balancer`, `elb-gateway-load-balancer`, `elb-network-load-balancer`, `endpoints`, `internet-gateway`, `mesh`, `network-access-control-list`, `nat-gateway`, `route-53-application-recovery-controller`, `route-53-hosted-zone`, `route-53-readiness-checks`, `route-53-resolver-dns-firewall`, `route-53-resolver-query-logging`, `route-53-resolver`, `route-53-routing-controls`, `route-table`, `transit-gateway-attachment`, `vpc-carrier-gateway-network-access-analyzer`, `vpc-carrier-gateway`, `vpc-customer-gateway`, `vpc-elastic-network-adapter`, `vpc-elastic-network-interface`, `vpc-flow-logs`, `vpc-peering-connection`, `vpc-reachability-analyzer`, `vpc-router`, `vpc-traffic-mirroring`, `vpn-connection`, `vpn-gateway`, `app-mesh-virtual-gateway`, `healthomics`, `healthscribe`, `healthimaging`, `bedrock`, `private-subnet`, `public-subnet`, `region`, `server-contents`, `account`, `auto-scaling-group`, `corporate-data-center`, `ec2-instance-contents`, `spot-fleet`, `workspaces-family`, `app-studio`, `appfabric`, `application-recovery-controller`, `b2b-data-interchange`, `clean-rooms`, `cloudseaws`, `codecatalyst`, `data-firehose`, `data-transfer-terminal`, `datazone`, `dcv`, `deadline-cloud`, `elastic-disaster-recovery`, `elastic-vmware-service`, `end-user-messaging`, `entity-resolution`, `fault-injection-service`, `file-cache`, `health-dashboard`, `infrastructure-composer`, `lightsail-for-research`, `managed-service-for-apache-flink`, `marketplace_dark`, `marketplace_light`, `memorydb`, `nova`, `oracle-database-at-aws`, `parallel-cluster`, `parallel-computing-service`, `payment-cryptography`, `private-certificate-authority`, `pytorch-on-aws`, `q`, `red-hat-openshift-service-on-aws`, `repost-private`, `resource-explorer`, `sagemaker-ai`, `security-incident-response`, `security-lake`, `service-management-connector`, `simspace-weaver`, `supply-chain`, `telco-network-builder`, `user-notifications`, `verified-access`, `verified-permissions`, `virtual-private-cloud`, `vpc-lattice`, `wickr`

#### Google Cloud Icons (175 icons)
**Note:** All GCP icons require the `gcp-` prefix when used in diagrams (e.g., `[icon: gcp-api]`).
`access-context-manager`, `administration`, `advanced-agent-modeling`, `advanced-solutions-lab`, `agent-assist`, `ai-hub`, `ai-platform-unified`, `ai-platform`, `analytics-hub`, `anthos-config-management`, `anthos-service-mesh`, `anthos`, `api-analytics`, `api-monetization`, `api`, `apigee-api-platform`, `apigee-sense`, `app-engine`, `artifact-registry`, `asset-inventory`, `assured-workloads`, `automl-natural-language`, `automl-tables`, `automl-translation`, `automl-video-intelligence`, `automl-vision`, `automl`, `bare-metal-solutions`, `batch`, `beyondcorp`, `bigquery`, `bigtable`, `billing`, `binary-authorization`, `catalog`, `certificate-authority-service`, `certificate-manager`, `cloud-api-gateway`, `cloud-apis`, `cloud-armor`, `cloud-asset-inventory`, `cloud-audit-logs`, `cloud-build`, `cloud-cdn`, `cloud-code`, `cloud-composer`, `cloud-data-fusion`, `cloud-deploy`, `cloud-deployment-manager`, `cloud-dns`, `cloud-domains`, `cloud-ekm`, `cloud-endpoints`, `cloud-external-ip-addresses`, `cloud-firewall-rules`, `cloud-for-marketing`, `cloud-functions`, `cloud-generic`, `cloud-gpu`, `cloud-healthcare-api`, `cloud-healthcare-marketplace`, `cloud-hsm`, `cloud-ids`, `cloud-inference-api`, `cloud-interconnect`, `cloud-jobs-api`, `cloud-load-balancing`, `cloud-logging`, `cloud-media-edge`, `cloud-monitoring`, `cloud-nat`, `cloud-natural-language-api`, `cloud-network`, `cloud-ops`, `cloud-optimization-ai---fleet-routing-api`, `cloud-optimization-ai`, `cloud-router`, `cloud-routes`, `cloud-run-for-anthos`, `cloud-run`, `cloud-scheduler`, `cloud-security-scanner`, `cloud-shell`, `cloud-spanner`, `cloud-sql`, `cloud-storage`, `cloud-tasks`, `cloud-test-lab`, `cloud-tpu`, `cloud-translation-api`, `cloud-vision-api`, `cloud-vpn`, `compute-engine`, `configuration-management`, `connectivity-test`, `connectors`, `contact-center-ai`, `container-optimized-os`, `container-registry`, `data-catalog`, `data-labeling`, `data-layers`, `data-loss-prevention-api`, `data-qna`, `data-studio`, `data-transfer`, `database-migration-service`, `dataflow`, `datalab`, `dataplex`, `datapol`, `dataprep`, `dataproc-metastore`, `dataproc`, `datashare`, `datastore`, `datastream`, `debugger`, `developer-portal`, `dialogflow-cx`, `dialogflow-insights`, `dialogflow`, `document-ai`, `early-access-center`, `error-reporting`, `eventarc`, `filestore`, `financial-services-marketplace`, `firestore`, `fleet-engine`, `free-trial`, `game-servers`, `gce-systems-management`, `genomics`, `gke-on-prem`, `google-cloud-marketplace`, `google-kubernetes-engine`, `google-maps-platform`, `healthcare-nlp-api`, `home`, `identity-and-access-management`, `identity-platform`, `identity-aware-proxy`, `iot-core`, `iot-edge`, `key-access-justifications`, `key-management-service`, `kuberun`, `launcher`, `local-ssd`, `looker`, `managed-service-for-microsoft-active-directory`, `media-translation-api`, `memorystore`, `migrate-for-anthos`, `migrate-for-compute-engine`, `my-cloud`, `network-connectivity-center`, `network-intelligence-center`, `network-security`, `network-tiers`, `network-topology`, `onboarding`, `os-configuration-management`, `os-inventory-management`, `os-patch-management`, `partner-interconnect`, `partner-portal`, `performance-dashboard`, `permissions`, `persistent-disk`, `phishing-protection`, `policy-analyzer`, `premium-network-tier`, `private-connectivity`, `private-service-connect`, `producer-portal`, `profiler`, `project`, `pubsub`, `quantum-engine`, `quotas`, `real-world-insights`, `recommendations-ai`, `release-notes`, `retail-api`, `risk-manager`, `runtime-config`, `secret-manager`, `security-command-center`, `security-health-advisor`, `security-key-enforcement`, `security`, `service-discovery`, `speech-to-text`, `stackdriver`, `standard-network-tier`, `stream-suite`, `support`, `tensorflow-enterprise`, `text-to-speech`, `tools-for-powershell`, `trace`, `traffic-director`, `transfer-appliance`, `transfer`, `user-preferences`, `vertexai`, `video-intelligence-api`, `virtual-private-cloud`, `visual-inspection`, `vmware-engine`, `web-risk`, `web-security-scanner`, `workflows`, `workload-identity-pool`

#### Azure Icons (572 icons)
**Note:** All Azure icons require the `azure-` prefix when used in diagrams (e.g., `[icon: azure-stack]`).
`batch-ai`, `machine-learning-studio-classic-web-services`, `genomics`, `translator-text`, `experimentation-studio`, `object-understanding`, `cognitive-services`, `genomics-accounts`, `bot-services`, `machine-learning`, `machine-learning-studio-workspaces`, `machine-learning-studio-web-service-plans`, `applied-ai`, `language-services`, `log-analytics-workspaces`, `event-hubs`, `stream-analytics-jobs`, `endpoint-analytics`, `synapse-analytics`, `workbooks`, `hd-insight-clusters`, `data-lake-analytics`, `analysis-services`, `event-hub-clusters`, `data-lake-store-gen1`, `databricks`, `app-service-plans`, `app-service-certificates`, `app-service-domains`, `cdn-profiles`, `app-services`, `api-management-services`, `search-services`, `notification-hubs`, `app-service-environments`, `collaborative-service`, `applens`, `hybrid-center`, `multi-tenancy`, `infrastructure-backup`, `capacity`, `offers`, `user-subscriptions`, `plans`, `stack`, `updates`, `avs`, `blockchain-applications`, `outbound-connection`, `blockchain-service`, `token-service`, `abs-member`, `consortium`, `maintenance-configuration`, `disk-encryption-sets`, `workspaces`, `automanaged-vm`, `managed-service-fabric`, `metrics-advisor`, `image-templates`, `restore-points`, `restore-points-collections`, `compute-galleries`, `virtual-machine`, `kubernetes-services`, `mesh-applications`, `availability-sets`, `disks-snapshots`, `os-images-classic`, `virtual-machines-classic`, `function-apps`, `cloud-services-classic`, `batch-accounts`, `disks`, `images`, `vm-scale-sets`, `service-fabric-clusters`, `image-definitions`, `image-versions`, `shared-image-galleries`, `vm-images-classic`, `disks-classic`, `container-services-deprecated`, `container-instances`, `host-groups`, `hosts`, `spring-cloud`, `container-registries`, `sql-data-warehouses`, `sql`, `ssis-lift-and-shift-ir`, `purview-accounts`, `sql-edge`, `database-postgresql-server-group`, `cosmos-db`, `database-mysql-server`, `database-mariadb-server`, `sql-vm`, `data-factory`, `virtual-clusters`, `elastic-job-agents`, `sql-database`, `database-postgresql-server`, `sql-server`, `database-migration-services`, `sql-elastic-pools`, `managed-database`, `sql-managed-instance`, `sql-server-stretch-databases`, `cache-redis`, `instance-pools`, `data-explorer-clusters`, `sql-server-registries`, `application-insights`, `cloudtest`, `devops`, `devtest-labs`, `lab-services`, `cost-management-and-billing`, `preview-features`, `all-resources`, `subscriptions`, `reservations`, `service-health`, `information`, `recent`, `resource-groups`, `marketplace`, `templates`, `quickstart-center`, `management-groups`, `help-and-support`, `tag`, `dashboard`, `free-services`, `cost-management`, `region-management`, `troubleshoot`, `resource-explorer`, `biz-talk`, `blob-block`, `blob-page`, `branch`, `browser`, `bug`, `builds`, `cache`, `code`, `commit`, `controls`, `controls-horizontal`, `cost-alerts`, `cost-analysis`, `cost-budgets`, `counter`, `cubes`, `dev-console`, `download`, `error`, `extensions`, `file`, `files`, `folder-blank`, `folder-website`, `ftp`, `gear`, `globe-error`, `globe-success`, `globe-warning`, `guide`, `heart`, `image`, `input-output`, `journey-hub`, `launch-portal`, `learn`, `load-test`, `location`, `log-streaming`, `management-portal`, `media-file`, `mobile`, `mobile-engagement`, `power`, `powershell`, `power-up`, `preview`, `process-explorer`, `production-ready-database`, `resource-group-list`, `resource-linked`, `scale`, `scheduler`, `search`, `server-farm`, `ssd`, `storage-files`, `storage-container`, `storage-queue`, `table`, `tags`, `tfs-vc-repository`, `toolbox`, `versions`, `website-power`, `website-staging`, `web-slots`, `web-test`, `workflow`, `backlog`, `media`, `module`, `search-grid`, `verifiable-credentials`, `pim`, `tenant-properties`, `custom-ad-roles`, `aad-licenses`, `active-directory`, `ad-domain-services`, `groups`, `active-directory-connect-health`, `enterprise-applications`, `managed-identities`, `ad-b2c`, `information-protection`, `users`, `ad-identity-protection`, `app-registrations`, `ad-privilege-identity-management`, `identity-governance`, `integration-service-environments`, `partner-topic`, `system-topic`, `partner-registration`, `partner-namespace`, `logic-apps`, `event-grid-topics`, `relays`, `api-for-fhir`, `software-as-a-service`, `event-grid-domains`, `data-catalog`, `integration-accounts`, `app-configuration`, `sendgrid-accounts`, `event-grid-subscriptions`, `logic-apps-custom-connector`, `service-bus`, `time-series-insights-access-policies`, `device-security-apple`, `device-security-google`, `device-security-windows`, `intune`, `ebooks`, `client-apps`, `devices`, `device-compliance`, `software-updates`, `security-baselines`, `device-enrollment`, `device-configuration`, `exchange-access`, `ad-roles-and-administrators`, `tenant-status`, `intune-for-education`, `intune-app-protection`, `mindaro`, `digital-twins`, `industrial-iot`, `time-series-insights-environments`, `iot-hub`, `iot-central-applications`, `maps-accounts`, `iot-edge`, `time-series-insights-event-sources`, `time-series-data-sets`, `windows10-core-services`, `device-provisioning-services`, `monitor`, `alerts`, `advisor`, `blueprints`, `activity-log`, `diagnostics-settings`, `scheduler-job-collections`, `compliance`, `my-customers`, `recovery-services-vaults`, `metrics`, `solutions`, `automation-accounts`, `operation-log-classic`, `service-providers`, `education`, `service-catalog-mad`, `lighthouse`, `universal-print`, `arc`, `user-privacy`, `managed-desktop`, `managed-applications-center`, `customer-lockbox-for-microsoft-azure`, `policy`, `resource-graph-explorer`, `machinesazurearc`, `keys`, `data-box`, `data-box-edge`, `migrate`, `remote-rendering`, `spatial-anchor-accounts`, `sap-monitor`, `firewall-manager`, `private-link`, `ip-groups`, `private-link-service`, `resource-management-private-link`, `private-link-hub`, `load-balancer-hub`, `bastions`, `virtual-router`, `spot-vmss`, `spot-vm`, `dns-private-resolver`, `virtual-networks`, `load-balancers`, `virtual-network-gateways`, `dns-zones`, `traffic-manager-profiles`, `network-watcher`, `network-security-groups`, `public-ip-addresses-classic`, `public-ip-addresses`, `on-premises-data-gateways`, `route-filters`, `ddos-protection-plans`, `front-doors`, `virtual-networks-classic`, `application-gateways`, `local-network-gateways`, `expressroute-circuits`, `network-interfaces`, `connections`, `route-tables`, `firewalls`, `service-endpoint-policies`, `nat`, `virtual-wans`, `web-application-firewall-policies-waf`, `proximity-placement-groups`, `reserved-ip-addresses-classic`, `public-ip-prefixes`, `intune-trends`, `dashboard-hub`, `avs-vm`, `network-manager`, `dedicated-hsm`, `modular-data-center`, `api-proxy`, `fiji`, `monitor-dashboard`, `support-center-blue`, `connected-cache`, `web-app-+-database`, `hpc-workbench`, `connected-vehicle-platform`, `aquila`, `reserved-capacity`, `custom-ip-prefix`, `confidential-ledger`, `reserved-capacity-groups`, `windows-notification-services`, `mission-landing-zone`, `private-mobile-network`, `vm-application-definition`, `vm-application-version`, `edge-hardware-center`, `ceres`, `azurite`, `update-center`, `image-definition`, `image-version`, `savings-plan`, `worker-container-app`, `grafana`, `storage-tasks`, `sonic-dash`, `compliance-center`, `load-testing`, `acs-solutions-builder`, `container-app-environments`, `marketplace-management`, `edge-management`, `sphere`, `exchange-on-premises-access`, `azureattestation`, `web-jobs`, `windows-virtual-desktop`, `ssh-keys`, `internet-analyzer-profiles`, `cloud-shell`, `expressroute-direct`, `communication-services`, `peering-service`, `resource-mover`, `chaos-studio`, `template-specs`, `backup-center`, `device-update-iot-hub`, `cloud-services-extended-support`, `disk-pool`, `bare-metal-infrastructure`, `open-supply-chain-platform`, `managed-instance-apache-cassandra`, `test-base`, `orbital`, `network-function-manager`, `quotas`, `wac`, `rtos`, `detonation`, `defender`, `conditional-access`, `security-center`, `application-security-groups`, `key-vaults`, `sentinel`, `extendedsecurityupdates`, `stack-edge`, `hcp-cache`, `storage-accounts`, `storage-accounts-classic`, `storsimple-device-managers`, `data-lake-storage-gen1`, `storage-explorer`, `storsimple-data-managers`, `storage-sync-services`, `netapp-files`, `data-share-invitations`, `data-shares`, `import-export-jobs`, `fileshare`, `static-apps`, `api-connections`, `signalr`, `notification-hub-namespaces`, `media-service`,`openai`, `backup-vault`, `custom-vision`, `external-identities`, `microsoft-entra`, `iot-operations`, `a`, `administrative-units`, `ai-at-edge`, `ai-studio`, `aks-automatic`, `aks-istio`, `anomaly-detector`, `api-center`, `app-compliance-automation`, `app-space-component`, `app-space`, `application-gateway-containers`, `application-group`, `applied-ai-services`, `arc-data-services`, `arc-kubernetes`, `arc-machines`, `arc-postgresql`, `arc-sql-managed-instance`, `arc-sql-server`, `atm-multistack`, `auto-scale`, `bonsai`, `breeze`, `business-process-tracking`, `capacity-reservation-groups`, `center-for-sap`, `central-service-instance-for-sap`, `change-analysis`, `code-optimization`, `cognitive-search`, `cognitive-services-decisions`, `communications-gateway`, `community-images`, `compute-fleet`, `computer-vision`, `confidential-ledgers`, `consumption-commitment`, `container-apps-environments`, `content-moderators`, `content-safety`, `cost-export`, `data-collection-rules`, `data-factories`, `data-virtualization`, `database-instance-for-sap`, `databox-gateway`, `deployment-environments`, `dev-tunnels`, `devops-starter`, `dns-multistack`, `dns-security-policy`, `edge-actions`, `edge-storage-accelerator`, `elastic-san`, `engage-center-connect`, `entra-connect-health`, `entra-connect-sync`, `entra-connect`, `entra-domain-services`, `entra-global-secure-access`, `entra-id-protection`, `entra-identity-custom-roles`, `entra-identity-licenses`, `entra-identity-risky-signins`, `entra-identity-risky-users`, `entra-identity-roles-and-administrators`, `entra-internet-access`, `entra-managed-identities`, `entra-private-access`, `entra-privleged-identity-management`, `entra-verified-id`, `express-route-traffic-collector`, `external-id-modified`, `external-id`, `face-apis`, `feature-previews`, `fhir-service`, `fileshares`, `firewall-policy`, `form-recognizers`, `frd-qa`, `front-door-and-cdn-profiles`, `hdi-aks-cluster`, `host-pools`, `hpc-workbenches`, `icm-troubleshooting`, `identity-secure-score`, `immersive-readers`, `integration-environments`, `ip-address-manager`, `kubernetes-fleet-manager`, `lab-accounts`, `landing-zone`, `language-understanding`, `language`, `log-analytics-query-pack`, `managed-devops-pools`, `managed-file-shares`, `managed-grafana`, `managed-redis`, `medtech-service`, `microsoft-defender-easm`, `microsoft-defender-for-cloud`, `microsoft-defender-for-iot`, `microsoft-dev-box`, `mobile-networks`, `monitor-health-models`, `monitor-pipeline`, `monitors-for-sap-solutions`, `multi-factor-authentication`, `multifactor-authentication`, `network-function-manager-functions`, `network-managers`, `network-security-perimeters`, `operator-5g-core`, `operator-insights`, `operator-nexus`, `operator-service-manager`, `oracle-database`, `osconfig`, `peerings`, `personalizers`, `power-bi-embedded`, `power-platform`, `private-endpoints`, `private-link-services`, `programmable-connectivity`, `qna-makers`, `red-hat-openshift`, `resource-guard`, `resources-provider`, `savings-plans`, `scvmm-management-servers`, `security`, `serverless-search`, `speech-services`, `spring-apps`, `sql-database-fleet-manager`, `stack-hci-premium`, `stack-hci-sizer`, `storage-actions`, `storage-functions`, `storage-mover`, `subnet`, `sustainability`, `targets-management`, `toolchain-orchestrator`, `update-management-center`, `user-settings`, `verification-as-a-service`, `video-analyzers`, `video-indexer`, `virtual-desktop`, `virtual-enclaves`, `virtual-instance-for-sap`, `virtual-visits-builder`, `virtual-wan-hub`, `vm-app-definitions`, `vm-app-versions`, `vm-image-version`, `vmware-solution`, `vpnclientwindows`, `wac-installer`, `web-application-firewall-policieswaf`, `workload-orchestration`, `workspace-gateway`

#### Azure Icons without prefix (68 icons)
`d365-customer-service`, `power-automate`, `power-ai-builder`, `power-pages`, `power-platform`, `d365-product-insights`, `d365-sales-insights`, `power-bi`, `dynamics-365`, `power-virtual-agents`, `d365-sales`, `d365-guides`, `d365-marketing`, `d365-customer-voice`, `d365-project-service-automation`, `d365-customer-service-insights`, `d365-project-operations`, `d365-finance-operations`, `power-apps`, `d365-business-central`, `power-fx`, `d365-connected-store`, `d365-field-service`, `d365-hr`, `d365-finance`, `d365-fruad-protection`, `d365-market-insights`, `d365-intelligent-order-management`, `d365-talent`, `d365-supply-chain-managements`, `d365-customer-insights`, `d365-commerce`, `power-dataverse`, `d365-remote-assist`

#### Kubernetes Icons (41 icons)
**Note:** All Kubernetes icons require the `k8s-` prefix when used in diagrams (e.g., `[icon: k8s-api]`).
`kubernetes`, `api`, `c-c-m`, `c-m`, `k-proxy`, `kubelet`, `sched`, `control-plane`, `node`, `etcd`, `c-role`, `cm`, `crb`, `crd`, `cronjob`, `deploy`, `ds`, `ep`, `group`, `hpa`, `ing`, `job`, `limits`, `netpol`, `ns`, `pod`, `psp`, `pv`, `pvc`, `quota`, `rb`, `role`, `rs`, `sa`, `sc`, `secret`, `sts`, `svc`, `user`, `vol`

#### Networking Icons (21 icons)
`router`, `nas`, `load-balancer`, `wlc`, `switch`, `ldap`, `interconnect`, `firewall`, `client`, `dslam`, `cisco-access-point`, `cisco-bridge`, `cisco-dslam`, `cisco-firewall`, `cisco-laptop`, `cisco-load-balancer`, `cisco-modem`, `cisco-nas`, `cisco-pc`, `cisco-phone`, `cisco-router`, `cisco-server`, `cisco-switch`, `cisco-vpn-gateway`, `cisco-wireless-router`, `cisco-wlc`

#### Tech Logos (365 icons)
`adobe`, `airflow`, `airplay-audio`, `airplay-video`, `algolia`, `alibaba-cloud`, `alibaba`, `alipay`, `amazon`, `alexa`, `aws`, `amp`, `android`, `angular`, `ant`, `apache`, `cassandra`, `cloudstack`, `cordova`, `couchdb`, `druid`, `echarts`, `flink`, `groovy`, `hadoop`, `hive`, `kafka`, `kylin`, `maven`, `pulsar`, `rocketmq`, `solr`, `spark`, `tomcat`, `apollo-graphql`, `apple`, `apple-pay`, `apple-podcasts`, `app-store`, `arduino`, `assemblyscript`, `atlassian`, `auth0`, `authy`, `babel`, `bitcoin`, `bluetooth`, `bootstrap`, `box`, `brave`, `bytedance`, `chromecast`, `circleci`, `clojure`, `cloudflare`, `cockroach-labs`, `codepen`, `codesandbox`, `coffeescript`, `confluence`, `couchbase`, `cpanel`, `css3`, `cypress`, `dart`, `databricks`, `datadog`, `dbt`, `debian`, `deno`, `discord`, `django`, `docker`, `dot-net`, `dropbox`, `drupal`, `eclipse-ide`, `elastic`, `elasticsearch`, `electron`, `elixir`, `eslint`, `ethereum`, `facebook`, `fastly`, `figma`, `firebase`, `firefox`, `flask`, `flutter`, `gatsby`, `git`, `github`, `github-actions`, `gitlab`, `gmail`, `gnome`, `gnu`, `gnu-bash`, `gnu-emacs`, `go`, `google`, `google-analytics`, `google-calendar`, `chrome`, `google-cloud`, `google-drive`, `google-maps`, `google-meet`, `google-sheets`, `google-tag-manager`, `grafana`, `graphql`, `haskell`, `hasura`, `heroku`, `homebrew`, `html5`, `hubspot`, `ibm`, `ibm-cloud`, `ibm-watson`, `instagram`, `intellij-idea`, `intercom`, `internet-explorer`, `ios`, `jamstack`, `javascript`, `jekyll`, `jenkins`, `jest`, `jetbrains`, `jira`, `jquery`, `json`, `jupyter`, `kibana`, `kotlin`, `kubernetes`, `laravel`, `linux`, `lodash`, `linkedin`, `looker`, `loom`, `magento`, `mapbox`, `mariadb`, `markdown`, `marketo`, `messenger`, `meta`, `meteor`, `microsoft`, `access`, `azure`, `bing`, `edge`, `excel`, `exchange`, `office`, `outlook`, `powerpoint`, `sharepoint`, `sql-server`, `teams`, `word`, `mongodb`, `mozilla`, `mysql`, `neo4j`, `netlify`, `next`, `nginx`, `nintendo`, `node`, `npm`, `oculus`, `okta`, `oracle`, `perl`, `php`, `playstation`, `postgres`, `postman`, `powershell`, `prisma`, `pulumi`, `puppeteer`, `python`, `pytorch`, `rabbitmq`, `railway`, `raspberry-pi`, `react`, `red-hat`, `redis`, `redux`, `rss`, `rstudio`, `ruby-on-rails`, `rust`, `safari`, `salesforce`, `sap`, `scala`, `sentry`, `shopify`, `slack`, `snowflake`, `splunk`, `sqlite`, `square`, `stripe`, `svelte`, `swagger`, `swift`, `tableau`, `tencent-qq`, `tensorflow`, `terraform`, `typescript`, `ubuntu`, `unity`, `vercel`, `vs-code`, `vite`, `vue`, `webassembly`, `webflow`, `webgl`, `webpack`, `webrtc`, `windows`, `whatsapp`, `x`, `wordpress`, `xbox`, `youtube`, `zendesk`, `zoom`, `1password`, `akamai`, `autodesk`, `bun`, `clickhouse`, `digitalocean`, `docusign`, `duckdb`, `express`, `fortinet`, `godaddy`, `hotjar`, `kong`, `linear`, `notion`, `openai`, `planetscale`, `playwright`, `qualtrics`, `sequelize`, `snapchat`, `solid`, `stack-overflow`, `tailwind-css`, `telegram`, `trpc`, `twilio`, `vmware`, `yubico`, `celery`, `metabase`, `supabase`, `travis-ci`, `spring`, `consul`, `logstash`, `prometheus`, `upstash`, `wolfram`, `zapier`, `ms-sql-server`, `rancher`, `nest`, `java`, `fastapi`, `bitbucket`, `socket-io`, `c-sharp`, `dell`, `visa`, `netflix`, `openstack`, `minecraft`, `strapi`, `sumologic`, `paypal`, `google-play`, `influxdb`, `ansible`, `ruby`, `cisco`, `opentelemetry`, `istio`, `helm`, `traefik`, `selenium`, `mulesoft`, `proxmox`, `packer`, `tiktok`, `openshift`, `wikipedia`, `temporal`, `storybook`, `newrelic`, `cpp`, `streamlit`, `yaml`, `visual-basic`, `sanity`, `posthog`, `mongoose`, `argo`, `docusaurus`, `scylla`, `chromatic`, `alteryx`, `hashicorp`, `intuit`, `sst`, `paloaltonetworks`, `qlik`, `pydantic`, `recoil`, `pandas`, `retool`, `arc`, `sqlalchemy`, `prefect`, `nvidia`, `arangodb`, `google-apps-script`, `anthropic`, `cohere`, `pinecone`, `weaviate`, `onedrive`, `clerk`, `canva`, `shadcn-ui`, `github-copilot`, `biome`, `nextdns`, `calendly`, `solana`, `resend`, `1password`, `akamai`, `gemini`, `keycloak`, `uipath`, `superset`, `gusto`, `sendgrid`, `replit`, `elevenlabs`, `obsidian`, `claude`, `hugging-face`, `langchain`, `n8n`, `perplexity`, `deepseek`, `metaflow`, `fivetran`, `rudderstack`, `cloudquery`, `sqlmesh`, `dagster`, `monte-carlo`, `segment`, `airbyte`

#### General Icons (311 icons)
`activity`, `airplay`, `alert-circle`, `alert-octagon`, `alert-triangle`, `align-center`, `align-justify`, `align-left`, `align-right`, `anchor`, `aperture`, `archive`, `arrow-down-circle`, `arrow-down-left`, `arrow-down-right`, `arrow-down`, `arrow-left-circle`, `arrow-left`, `arrow-right-circle`, `arrow-right`, `arrow-up-circle`, `arrow-up-left`, `arrow-up-right`, `arrow-up`, `at-sign`, `award`, `bar-chart-2`, `bar-chart`, `battery-charging`, `battery`, `bell-off`, `bell`, `bold`, `book-open`, `book`, `bookmark`, `briefcase`, `calendar`, `camera-off`, `camera`, `cast`, `check-circle`, `check-square`, `check`, `chevron-down`, `chevron-left`, `chevron-right`, `chevron-up`, `chevrons-down`, `chevrons-left`, `chevrons-right`, `chevrons-up`, `circle`, `clipboard`, `clock`, `cloud-drizzle`, `cloud-lightning`, `cloud-off`, `cloud-rain`, `cloud-snow`, `cloud`, `code`, `coffee`, `columns`, `command`, `compass`, `copy`, `corner-down-left`, `corner-down-right`, `corner-left-down`, `corner-left-up`, `corner-right-down`, `corner-right-up`, `corner-up-left`, `corner-up-right`, `cpu`, `credit-card`, `crop`, `crosshair`, `database`, `delete`, `disc`, `divide-circle`, `divide-square`, `divide`, `dollar-sign`, `download-cloud`, `download`, `dribbble`, `droplet`, `edit-2`, `edit-3`, `edit`, `external-link`, `eye-off`, `eye`, `fast-forward`, `feather`, `file-minus`, `file-plus`, `file-text`, `file`, `film`, `filter`, `flag`, `folder-minus`, `folder-plus`, `folder`, `framer`, `frown`, `gift`, `git-branch`, `git-commit`, `git-merge`, `git-pull-request`, `globe`, `grid`, `hard-drive`, `hash`, `headphones`, `heart`, `help-circle`, `hexagon`, `home`, `image`, `inbox`, `info`, `italic`, `key`, `layers`, `layout`, `life-buoy`, `link-2`, `link`, `list`, `loader`, `lock`, `log-in`, `log-out`, `map-pin`, `mail`, `map`, `maximize-2`, `maximize`, `meh`, `menu`, `message-circle`, `message-square`, `mic-off`, `mic`, `minimize-2`, `minimize`, `minus-circle`, `minus-square`, `minus`, `monitor`, `moon`, `more-horizontal`, `more-vertical`, `mouse-pointer`, `move`, `music`, `navigation-2`, `navigation`, `octagon`, `package`, `paperclip`, `pause-circle`, `pause`, `pen-tool`, `percent`, `phone-call`, `phone-forwarded`, `phone-incoming`, `phone-missed`, `phone-off`, `phone-outgoing`, `phone`, `pie-chart`, `play-circle`, `play`, `plus-circle`, `plus-square`, `plus`, `power`, `pocket`, `printer`, `radio`, `refresh-ccw`, `refresh-cw`, `repeat`, `rewind`, `rotate-ccw`, `rotate-cw`, `save`, `scissors`, `search`, `send`, `server`, `settings`, `share-2`, `share`, `shield-off`, `shield`, `shopping-bag`, `shopping-cart`, `shuffle`, `sidebar`, `skip-back`, `skip-forward`, `slash`, `sliders`, `smartphone`, `smile`, `speaker`, `star`, `stop-circle`, `sun`, `sunrise`, `sunset`, `tablet`, `tag`, `target`, `terminal`, `thermometer`, `thumbs-down`, `thumbs-up`, `toggle-left`, `toggle-right`, `tool`, `trash-2`, `trash`, `trello`, `trending-down`, `trending-up`, `triangle`, `truck`, `tv`, `twitch`, `twitter`, `type`, `umbrella`, `underline`, `unlock`, `upload-cloud`, `upload`, `user-check`, `user-minus`, `user-plus`, `user-x`, `user`, `users`, `video-off`, `video`, `voicemail`, `volume-1`, `volume-2`, `volume-x`, `volume`, `watch`, `wifi-off`, `wifi`, `wind`, `x-circle`, `x-octagon`, `x-square`, `x`, `zap-off`, `zap`, `zoom-in`, `zoom-out`, `activity-square`, `arrow-with-dot`, `orbit`, `shield-check`, `wifi-router`, `building`, `network`, `robot`, `car`, `plug`, `plugs`, `brain`, `store`, `lightbulb`, `history`, `gavel`, `hammer`, `calculator`, `stethoscope`, `gamepad`, `recycle`, `braces`, `laptop`, `scale`, `cloud-cog`, `ticket`, `pill`, `tree`, `leaf`, `trophy`, `puzzle`, `paintbrush`, `function`, `split`, `rocket`, `airplane`, `table`, `bug`, `bone`, `box`, `gem`, `handshake`, `fire`, `qr-code`, `factory`, `ruler`, `euro`, `hand`, `sort`, `fingerprint`, `dna`

### Best Practices for LLMs
1. Always use unique names for nodes/entities/columns
2. Use the `label` property when multiple elements need the same display text
3. Specify icons for cloud architecture diagrams
4. Use appropriate arrow types for relationship cardinality
5. Group related elements for better organization
6. Apply diagram-level styling for consistency
7. Use quotes for names with spaces or special characters
8. Chain connections for linear flows
9. Use blocks in sequence diagrams for control flow
10. Set direction based on diagram layout preference