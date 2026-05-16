# Study Plan DOP-C02 — Retake Sprint 14 Ngay

## Tom tat

**Muc tieu:** AWS Certified DevOps Engineer - Professional (DOP-C02)

**Diem lan thi gan nhat:** 696/1000

**Passing score:** 750/1000

**Khoang cach toi pass:** thieu 54 diem

**Domain result:**
- Meets Competencies: D3 Resilient Cloud Solutions
- Needs Improvement: D1, D2, D4, D5, D6

**Chien luoc 14 ngay:** khong hoc lai tu dau. Tap trung tang diem nhanh o cac domain yeu theo trong so: D1 (22%) -> D6 (17%) -> D2 (17%) -> D4 (15%) -> D5 (14%). D3 chi review nhe de giu diem.

**Ready-to-book gate:**
- Tot nhat: mock full exam cuoi >= 80%.
- Chap nhan neu gap: 2 mock lien tiep >= 75% va khong domain nao < 70%.
- Chua nen thi lai: mock cuoi < 75% hoac D1/D6/D2 van < 70%.

**Quiz bank hien tai:** 450 cau trong `quiz-app/questions.json`, giu dung ty le exam mode 75 cau:

| Domain | Trong so | Bank | Exam session |
|---|---:|---:|---:|
| D1 SDLC Automation | 22% | 102 | 17 |
| D2 Configuration Management and IaC | 17% | 78 | 13 |
| D3 Resilient Cloud Solutions | 15% | 66 | 11 |
| D4 Monitoring and Logging | 15% | 66 | 11 |
| D5 Incident and Event Response | 14% | 66 | 11 |
| D6 Security and Compliance | 17% | 72 | 12 |

---

## Daily Rules

1. Moi cau sai phai doc explanation, mo reference AWS Docs, va ghi vao Weakness Log.
2. Khong dem cau dung neu chi doan. Cau doan dung van ghi vao Weakness Log.
3. Sau moi mock, ghi score tong, score tung domain, va 3 chu de yeu nhat.
4. Neu practice domain < 75%, lap lai notes + cau sai cua domain do truoc khi qua domain tiep theo.
5. Cach chay quiz app:

```bash
python3 -m http.server 8000 --directory DOP-C02/quiz-app
```

Mo: http://localhost:8000

---

## Sprint 14 Ngay

| Done | Day | Focus | Viec can lam | Verify |
|---|---:|---|---|---|
| [ ] | 1 | D1 CodePipeline | Cross-account/cross-region actions, artifact bucket, KMS, manual approval, EventBridge triggers | Practice D1 40-50 cau, ghi >= 10 cau sai |
| [ ] | 2 | D1 CodeBuild/CodeDeploy | buildspec, VPC build, Secrets Manager, ECS/Lambda/EC2 deployments, appspec, hooks, rollback | Practice D1 het pool hoac toi thieu 75 cau, muc tieu >= 75% |
| [ ] | 3 | D6 IAM/Org | IAM policy types, STS AssumeRole, SCP, permission boundary, session policy, Identity Center | Practice D6 40-50 cau |
| [ ] | 4 | D6 Security Services | KMS, Secrets Manager, Parameter Store, GuardDuty, Security Hub, Config, Macie, Inspector, Detective | Practice D6 het pool hoac toi thieu 60 cau, muc tieu >= 75% |
| [ ] | 5 | D2 CloudFormation | StackSets, change sets, drift, stack policy, nested stack, cross-stack refs, custom resources | Practice D2 40-50 cau |
| [ ] | 6 | D2 SSM/AppConfig/Beanstalk | State Manager, Patch Manager, Automation, AppConfig rollout, Control Tower, Service Catalog, OpsWorks, Beanstalk policy | Mini mock D1/D2/D6, muc tieu >= 70% |
| [ ] | 7 | Mock #1 | Exam mode 75 cau / 180 phut. Review tat ca cau sai va cau doan | Baseline; lap Weakness Log top 10 |
| [ ] | 8 | D4 Monitoring | CloudWatch metrics/logs/alarms, metric filters, subscription filters, Logs Insights, CloudTrail, Config | Practice D4 50+ cau |
| [ ] | 9 | D5 Incident Response | EventBridge, SQS/SNS/Lambda failure handling, Step Functions Retry/Catch, AWS Health, OpsCenter, auto-remediation | Practice D5 50+ cau |
| [ ] | 10 | D4+D5 Troubleshooting | Failed deployments, CloudFormation rollback, ECS/EKS scaling signals, Synthetics, X-Ray, ADOT, DLQ/redrive | Mixed practice D4+D5, muc tieu >= 75% |
| [ ] | 11 | Weakness Log Day | Lam lai top 20 topic sai nhieu nhat. Uu tien D1, D6, D2. Doc AWS Docs goc cho tung topic | Moi topic co 1 dong summary |
| [ ] | 12 | Mock #2 | Exam mode 75 cau / 180 phut. Review cau sai ngay trong ngay | Neu < 75%, quay lai domain thap nhat |
| [ ] | 13 | Mock #3 | Exam mode 75 cau / 180 phut. Chi review cau sai va cau doan | Muc tieu >= 80% |
| [ ] | 14 | Light Review | Cheatsheet, service comparison, deployment/rollback matrix, security matrix. Khong hoc topic moi | Chi thi neu dat ready-to-book gate |

---

## Domain Drill Checklist

### D1 — SDLC Automation

- [ ] CodePipeline cross-account roles, artifact bucket policy, KMS key policy.
- [ ] CodePipeline cross-region actions and regional artifact stores.
- [ ] Manual approval + SNS/AWS Chatbot notification.
- [ ] CodeBuild buildspec phases, reports, cache, exported variables.
- [ ] CodeBuild VPC access, NAT requirement, service role ENI permissions.
- [ ] Secrets in CodeBuild via Secrets Manager/Parameter Store with log masking.
- [ ] CodeDeploy EC2 in-place vs blue/green.
- [ ] CodeDeploy ECS blue/green: task set, target groups, listener, AppSpec.
- [ ] CodeDeploy Lambda traffic shifting, hooks, alarms, rollback.
- [ ] Elastic Beanstalk all-at-once, rolling, rolling with additional batch, immutable, blue/green.
- [ ] CodeArtifact domains, repositories, upstreams, external connections.
- [ ] EventBridge triggers for CodeCommit/CodePipeline state changes.

### D6 — Security and Compliance

- [ ] IAM identity policy, resource policy, permission boundary, session policy.
- [ ] SCP allow/deny behavior and interaction with account admin.
- [ ] STS AssumeRole, ExternalId, SAML/WebIdentity, cross-account trust.
- [ ] IAM Access Analyzer for external access.
- [ ] KMS key policy vs IAM policy vs grants.
- [ ] SSE-KMS cross-account access for S3 artifacts.
- [ ] Secrets Manager rotation vs Parameter Store configuration.
- [ ] GuardDuty findings and EventBridge response.
- [ ] Security Hub aggregation and standards.
- [ ] AWS Config rules, remediation, conformance packs, aggregators.
- [ ] CloudTrail organization trail, data events, Insights, log file validation.
- [ ] Macie vs Inspector vs Detective.
- [ ] WAF, Shield Advanced, Firewall Manager.

### D2 — Configuration Management and IaC

- [ ] CloudFormation change sets, stack policies, rollback states.
- [ ] Drift detection and manual-change recovery.
- [ ] StackSets service-managed vs self-managed.
- [ ] Nested stacks vs cross-stack exports/imports.
- [ ] Custom resources and macros.
- [ ] cfn-init, cfn-signal, cfn-hup.
- [ ] Systems Manager Run Command, Session Manager, State Manager.
- [ ] Patch Manager, Maintenance Windows, Inventory.
- [ ] SSM Automation and AWS Config remediation.
- [ ] AppConfig validators, deployment strategies, rollback on alarms.
- [ ] Service Catalog constraints and launch roles.
- [ ] Control Tower guardrails and Account Factory.
- [ ] OpsWorks Stacks lifecycle events.

### D4 — Monitoring and Logging

- [ ] CloudWatch standard/custom/high-resolution metrics.
- [ ] CloudWatch Logs metric filters, subscription filters, retention, KMS.
- [ ] Logs Insights queries for troubleshooting.
- [ ] CloudWatch alarms, composite alarms, anomaly detection, missing data.
- [ ] Metric Streams and Firehose delivery.
- [ ] CloudWatch Agent for memory/disk/process metrics.
- [ ] CloudTrail organization trail, management events, data events.
- [ ] AWS Config recorder, rules, conformance packs, aggregator.
- [ ] X-Ray traces, segments, subsegments, sampling.
- [ ] CloudWatch Synthetics and RUM.
- [ ] VPC Flow Logs to S3 + Athena.

### D5 — Incident and Event Response

- [ ] EventBridge rules, event buses, resource policies, archive/replay.
- [ ] AWS Health events to EventBridge.
- [ ] S3/RDS/ECS event notifications and state change events.
- [ ] Lambda async retry, destinations, DLQ.
- [ ] SQS DLQ, maxReceiveCount, redrive, visibility timeout.
- [ ] Step Functions Retry/Catch and compensation path.
- [ ] CodeDeploy rollback on alarm/failure.
- [ ] CloudFormation UPDATE_ROLLBACK_FAILED recovery.
- [ ] Systems Manager OpsCenter and Automation runbooks.
- [ ] AWS Config remediation.
- [ ] Service Quotas monitoring and proactive quota increase.
- [ ] Incident timeline: CloudWatch metrics/alarms, CloudTrail, Config, deploy history.

### D3 — Resilient Cloud Solutions

- [ ] Multi-AZ vs multi-Region tradeoffs.
- [ ] Route 53 failover, weighted, latency, geolocation.
- [ ] Auto Scaling target tracking, step, scheduled, predictive.
- [ ] ALB/NLB health checks and target group behavior.
- [ ] RDS Multi-AZ vs read replica vs Aurora Global Database.
- [ ] DynamoDB global tables and consistency tradeoffs.
- [ ] S3 replication, Object Lock, versioning.
- [ ] SQS buffering and idempotent consumers.
- [ ] DR strategies: backup/restore, pilot light, warm standby, active-active.

---

## Mock Exam Tracker

| Mock | Ngay | Score | % | D1 | D2 | D3 | D4 | D5 | D6 | Quyet dinh |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| #1 | | /75 | | | | | | | | Baseline |
| #2 | | /75 | | | | | | | | >= 75% de tiep tuc |
| #3 | | /75 | | | | | | | | >= 80% de dat lich |

**Decision rule:**
- Mock #3 >= 80%: dat lich thi lai.
- Mock #2 va #3 deu >= 75%, khong domain nao < 70%: co the thi neu gap.
- Bat ky mock cuoi < 75%: doi lich va quay lai Weakness Log.

---

## Weakness Log

Ghi moi cau sai theo format:

```text
Day __ | Domain __ | Topic __ | Vi sao sai __ | AWS doc __ | Can nho __
```

### Top 20 Weak Topics

1. 
2. 
3. 
4. 
5. 
6. 
7. 
8. 
9. 
10. 
11. 
12. 
13. 
14. 
15. 
16. 
17. 
18. 
19. 
20. 

---

## Resource Quick Links

- Quiz app local: [quiz-app/](quiz-app/)
- AWS DOP-C02 exam guide: https://docs.aws.amazon.com/aws-certification/latest/devops-engineer-professional-02/devops-engineer-professional-02.html
- Technologies and concepts: https://docs.aws.amazon.com/aws-certification/latest/devops-engineer-professional-02/dop-technologies-concepts.html
- In-scope services: https://docs.aws.amazon.com/aws-certification/latest/devops-engineer-professional-02/dop-02-in-scope-services.html
- AWS Docs: https://docs.aws.amazon.com/
- Tutorials Dojo practice exams: https://portal.tutorialsdojo.com/courses/aws-certified-devops-engineer-professional-practice-exams/
