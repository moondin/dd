---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 809
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 809 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: IconCompliance.tsx]---
Location: prowler-master/ui/components/icons/compliance/IconCompliance.tsx

```typescript
import AWSLogo from "./aws.svg";
import C5Logo from "./c5.svg";
import CCCLogo from "./ccc.svg";
import CISLogo from "./cis.svg";
import CISALogo from "./cisa.svg";
import ENSLogo from "./ens.png";
import FedRAMPLogo from "./fedramp.svg";
import FFIECLogo from "./ffiec.svg";
import GDPRLogo from "./gdpr.svg";
import GxPLogo from "./gxp-aws.svg";
import HIPAALogo from "./hipaa.svg";
import ISOLogo from "./iso-27001.svg";
import KISALogo from "./kisa.svg";
import MITRELogo from "./mitre-attack.svg";
import NIS2Logo from "./nis2.svg";
import NISTLogo from "./nist.svg";
import PCILogo from "./pci-dss.svg";
import PROWLERTHREATLogo from "./prowlerThreat.svg";
import RBILogo from "./rbi.svg";
import SOC2Logo from "./soc2.svg";

const COMPLIANCE_LOGOS = {
  aws: AWSLogo,
  cisa: CISALogo,
  cis: CISLogo,
  ens: ENSLogo,
  ffiec: FFIECLogo,
  fedramp: FedRAMPLogo,
  gdpr: GDPRLogo,
  gxp: GxPLogo,
  hipaa: HIPAALogo,
  iso: ISOLogo,
  mitre: MITRELogo,
  nist: NISTLogo,
  pci: PCILogo,
  rbi: RBILogo,
  soc2: SOC2Logo,
  kisa: KISALogo,
  prowlerthreatscore: PROWLERTHREATLogo,
  nis2: NIS2Logo,
  c5: C5Logo,
  ccc: CCCLogo,
} as const;

export const getComplianceIcon = (complianceTitle: string) => {
  const lowerTitle = complianceTitle.toLowerCase();
  return Object.entries(COMPLIANCE_LOGOS).find(([keyword]) =>
    lowerTitle.includes(keyword),
  )?.[1];
};
```

--------------------------------------------------------------------------------

````
