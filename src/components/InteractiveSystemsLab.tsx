import React, { useState, useEffect } from 'react';
import { EditionTheme } from '../data/portfolioData';

interface InteractiveSystemsLabProps {
  theme: EditionTheme;
}

interface MarketplaceListing {
  id: string;
  title: string;
  category: 'Textbooks' | 'Electronics' | 'Hostel Essentials';
  priceInr: number;
  hostelBlock: string;
  condition: string;
  sellerReg: string;
  verified: boolean;
}

const INITIAL_MARKETPLACE_ITEMS: MarketplaceListing[] = [
  {
    id: 'mk-1',
    title: 'Casio FX-991CW Scientific Calculator',
    category: 'Electronics',
    priceInr: 750,
    hostelBlock: 'Men’s Hostel M-Block',
    condition: 'Like New (1 Sem Used)',
    sellerReg: '26BIT0190 · Verified VIT Email',
    verified: true,
  },
  {
    id: 'mk-2',
    title: 'Higher Engineering Mathematics — B.S. Grewal (44th Ed.)',
    category: 'Textbooks',
    priceInr: 420,
    hostelBlock: 'Men’s Hostel N-Block',
    condition: 'Good · Clean Pages',
    sellerReg: '26BCE0412 · Verified VIT Email',
    verified: true,
  },
  {
    id: 'mk-3',
    title: 'Wipro 12W LED Rechargeable Study Desk Lamp',
    category: 'Hostel Essentials',
    priceInr: 380,
    hostelBlock: 'Men’s Hostel Q-Block',
    condition: 'Mint · USB-C Cable Included',
    sellerReg: '26BEC0289 · Verified VIT Email',
    verified: true,
  },
  {
    id: 'mk-4',
    title: 'OrCAD PSpice & Digital Logic Lab Kit + Breadboard Set',
    category: 'Electronics',
    priceInr: 550,
    hostelBlock: 'Men’s Hostel L-Block',
    condition: 'Complete IC & Jumper Set',
    sellerReg: '26BIT0190 · Verified VIT Email',
    verified: true,
  },
];

interface AircraftFeed {
  icao: string;
  callsign: string;
  route: string;
  altitudeFt: number;
  speedKts: number;
  headingDeg: number;
  squawk: string;
  rssiDbm: number;
}

const INITIAL_AIRCRAFT: AircraftFeed[] = [
  {
    icao: '800B4A',
    callsign: 'IGO6142',
    route: 'BBI (Bhubaneswar) → MAA (Chennai)',
    altitudeFt: 36000,
    speedKts: 468,
    headingDeg: 214,
    squawk: '4621',
    rssiDbm: -8.4,
  },
  {
    icao: '800D19',
    callsign: 'AIC549',
    route: 'BBI (Bhubaneswar) → BLR (Via Vellore)',
    altitudeFt: 38000,
    speedKts: 482,
    headingDeg: 228,
    squawk: '2204',
    rssiDbm: -6.1,
  },
  {
    icao: '8012C3',
    callsign: 'VTI824',
    route: 'CCU (Kolkata) → MAA (Chennai Corridor)',
    altitudeFt: 34000,
    speedKts: 454,
    headingDeg: 209,
    squawk: '4112',
    rssiDbm: -11.2,
  },
  {
    icao: '800E77',
    callsign: 'AXB312',
    route: 'MAA (Chennai) → BBI (Bhubaneswar)',
    altitudeFt: 35000,
    speedKts: 472,
    headingDeg: 34,
    squawk: '1455',
    rssiDbm: -7.8,
  },
];

interface GcpChallengeLabDetail {
  id: string;
  code: string;
  title: string;
  score: string;
  domain: string;
  services: string[];
  cliSnippet: string;
  checkpoints: string[];
}

const GCP_CHALLENGE_LABS: GcpChallengeLabDetail[] = [
  {
    id: 'gcp-data',
    code: 'CHALLENGE LAB 01 // DATA & SERVERLESS',
    title: 'Store, Process, and Manage Data on Google Cloud: Challenge Lab',
    score: '100.0%',
    domain: 'Cloud Storage · Pub/Sub · Cloud Run Functions (Gen 2) · IAM',
    services: ['Cloud Storage', 'Cloud Pub/Sub', 'Cloud Functions Gen2', 'Eventarc', 'IAM Roles'],
    cliSnippet: `gcloud storage buckets create gs://$BUCKET_NAME --location=$REGION
gcloud pubsub topics create $TOPIC_NAME
gcloud functions deploy memories-thumbnail-maker \\
  --gen2 --runtime=nodejs22 --region=$REGION \\
  --trigger-bucket=$BUCKET_NAME --entry-point=thumbnail`,
    checkpoints: [
      'Created regional Cloud Storage bucket with uniform bucket-level access (100%)',
      'Configured Pub/Sub topic & Eventarc Cloud Storage object-finalize trigger (100%)',
      'Deployed Gen-2 serverless function processing uploaded images into thumbnails (100%)',
    ],
  },
  {
    id: 'gcp-compute',
    code: 'CHALLENGE LAB 02 // COMPUTE & VPC',
    title: 'The Basics of Google Cloud Compute: Challenge Lab',
    score: '100.0%',
    domain: 'Compute Engine VMs · Persistent Disks · VPC Firewall Rules · Nginx/Apache',
    services: ['Compute Engine', 'Persistent Disk (SSD)', 'VPC Network', 'Firewall Rules', 'Cloud Shell'],
    cliSnippet: `gcloud compute instances create my-instance --zone=$ZONE \\
  --machine-type=e2-medium --tags=http-server
gcloud compute disks create my-disk --size=200GB --zone=$ZONE
gcloud compute instances attach-disk my-instance --disk=my-disk --zone=$ZONE`,
    checkpoints: [
      'Provisioned Compute Engine VM instance in designated zone & subnet (100%)',
      'Created, attached, formatted (mkfs.ext4), and mounted 200GB Persistent Disk (100%)',
      'Configured HTTP ingress firewall rule and verified live web server response (100%)',
    ],
  },
  {
    id: 'gcp-monitoring',
    code: 'CHALLENGE LAB 03 // OBSERVABILITY & SRE',
    title: 'Monitoring in Google Cloud: Challenge Lab',
    score: '100.0%',
    domain: 'Cloud Monitoring · Cloud Logging · Ops Agent · Uptime Checks & Alerting',
    services: ['Cloud Monitoring', 'Cloud Logging', 'Ops Agent', 'Uptime Checks', 'Alert Policies'],
    cliSnippet: `curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install
gcloud logging metrics create High-Latency-Error-Rate \\
  --description="Custom log-based metric for VM HTTP latency & errors"`,
    checkpoints: [
      'Installed & verified Google Cloud Ops Agent telemetry stream on Compute VM (100%)',
      'Configured global HTTP Uptime Check & custom Cloud Monitoring Dashboard chart (100%)',
      'Created log-based metric and multi-channel Alerting Policy trigger (100%)',
    ],
  },
];

export const InteractiveSystemsLab: React.FC<InteractiveSystemsLabProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'aeropulse' | 'gcp' | 'nanobiotech'>(
    'marketplace'
  );
  const [selectedGcpLab, setSelectedGcpLab] = useState<GcpChallengeLabDetail>(GCP_CHALLENGE_LABS[0]);

  // VIT Campus Marketplace Sandbox state
  const [marketItems, setMarketItems] = useState<MarketplaceListing[]>(INITIAL_MARKETPLACE_ITEMS);
  const [marketCategory, setMarketCategory] = useState<
    'All' | 'Textbooks' | 'Electronics' | 'Hostel Essentials'
  >('All');
  const [marketQuery, setMarketQuery] = useState<string>('');
  const [showLiveIframe, setShowLiveIframe] = useState<boolean>(false);

  // AeroPulse ADS-B live ticker state
  const [aircraft, setAircraft] = useState<AircraftFeed[]>(INITIAL_AIRCRAFT);
  const [adsbPackets, setAdsbPackets] = useState<number>(14820);

  useEffect(() => {
    const interval = setInterval(() => {
      setAdsbPackets((prev) => prev + Math.floor(Math.random() * 14 + 6));
      setAircraft((prev) =>
        prev.map((ac, idx) => ({
          ...ac,
          speedKts: ac.speedKts + (idx % 2 === 0 ? 1 : -1) * (Math.random() > 0.5 ? 1 : 0),
          rssiDbm: Number((ac.rssiDbm + (Math.random() - 0.5) * 0.4).toFixed(1)),
        }))
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const filteredMarketItems = marketItems.filter((item) => {
    if (marketCategory !== 'All' && item.category !== marketCategory) return false;
    if (marketQuery.trim()) {
      const q = marketQuery.trim().toLowerCase();
      if (
        !item.title.toLowerCase().includes(q) &&
        !item.hostelBlock.toLowerCase().includes(q) &&
        !item.category.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const handleSimulateNewListing = () => {
    const samples: Omit<MarketplaceListing, 'id'>[] = [
      {
        title: 'Computer Organization & Design (RISC-V Edition) — Patterson & Hennessy',
        category: 'Textbooks',
        priceInr: 490,
        hostelBlock: 'Men’s Hostel K-Block',
        condition: 'Like New',
        sellerReg: '26BIT0190 · Verified VIT Email',
        verified: true,
      },
      {
        title: 'Logitech M331 Silent Wireless Mouse (2.4 GHz)',
        category: 'Electronics',
        priceInr: 600,
        hostelBlock: 'Men’s Hostel M-Block',
        condition: 'Box Packed',
        sellerReg: '26BDS0118 · Verified VIT Email',
        verified: true,
      },
      {
        title: 'Milton Thermosteel 1L Flask + Kettle Combo',
        category: 'Hostel Essentials',
        priceInr: 520,
        hostelBlock: 'Men’s Hostel P-Block',
        condition: 'Cleaned & Sanitized',
        sellerReg: '26BIT0190 · Verified VIT Email',
        verified: true,
      },
    ];
    const pick = samples[marketItems.length % samples.length];
    setMarketItems((prev) => [{ id: 'mk-' + Date.now(), ...pick }, ...prev]);
  };

  return (
    <div className="mt-10 pt-8 border-t border-white/10 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono-code uppercase tracking-[0.22em] text-[#D4AF37]">
            LIVE PROJECT INTERACTIVE DEMOS // SECTION 04 SANDBOX
          </div>
          <h3 className={`${theme.headingFontClass} text-xl sm:text-2xl font-bold text-white mt-1`}>
            VIT Campus Marketplace, AeroPulse ADS-B, Google Cloud Arcade &amp; Aquaculture MDP
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 bg-[#07080B] p-1.5 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('marketplace')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono-code transition ${
              activeTab === 'marketplace'
                ? 'bg-[#D4AF37] text-[#07080B] font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            01. Campus Marketplace
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('aeropulse')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono-code transition ${
              activeTab === 'aeropulse'
                ? 'bg-[#38BDF8] text-[#07080B] font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            02. AeroPulse ADS-B (1090 MHz)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gcp')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono-code transition ${
              activeTab === 'gcp'
                ? 'bg-amber-400 text-[#07080B] font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            03. Google Cloud Arcade (100%)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nanobiotech')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono-code transition ${
              activeTab === 'nanobiotech'
                ? 'bg-emerald-400 text-[#07080B] font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            04. Aquaculture MDP Matrix
          </button>
        </div>
      </div>

      {/* TAB 1: VIT CAMPUS MARKETPLACE SANDBOX (delete-ruby.vercel.app) */}
      {activeTab === 'marketplace' && (
        <div className="spotlight-card rounded-2xl p-6 sm:p-8 space-y-6 border-[#D4AF37]/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs font-mono-code text-[#D4AF37]">
                FIREBASE REALTIME STORE + VERCEL EDGE CI · LIVE AT DELETE-RUBY.VERCEL.APP
              </div>
              <h4 className="font-cinzel text-lg sm:text-xl font-bold text-white mt-0.5">
                VIT Campus Marketplace — Peer-to-Peer Student Exchange Sandbox
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono-code">
              <button
                type="button"
                onClick={handleSimulateNewListing}
                className="px-3.5 py-2 rounded-xl bg-[#38BDF8] hover:bg-sky-300 text-[#07080B] font-bold transition shadow"
              >
                + Simulate Firebase Listing
              </button>
              <button
                type="button"
                onClick={() => setShowLiveIframe((prev) => !prev)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-[#D4AF37]/45 text-[#D4AF37] font-semibold transition"
              >
                {showLiveIframe ? 'Hide Live App Embed' : 'Embed Live Vercel App'}
              </button>
              <a
                href="https://delete-ruby.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-amber-300 text-[#07080B] font-bold transition shadow"
              >
                Open delete-ruby.vercel.app ↗
              </a>
            </div>
          </div>

          {/* Category Filter Pills & Instant Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(['All', 'Textbooks', 'Electronics', 'Hostel Essentials'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMarketCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-code border transition ${
                    marketCategory === cat
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] font-bold'
                      : 'bg-slate-950/85 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <input
              type="search"
              value={marketQuery}
              onChange={(e) => setMarketQuery(e.target.value)}
              placeholder="Search textbook, calculator, M-Block..."
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono-code text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] w-full sm:w-64"
            />
          </div>

          {/* Student Exchange Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMarketItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-[#D4AF37]/50 flex flex-col justify-between space-y-3 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono-code">
                    <span className="px-2 py-0.5 rounded bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                      {item.category}
                    </span>
                    <span className="text-emerald-400 font-bold text-sm">₹{item.priceInr}</span>
                  </div>
                  <div className="font-cinzel font-bold text-sm sm:text-base text-white">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-400">
                    Pickup: <span className="text-slate-200">{item.hostelBlock}</span> · Condition:{' '}
                    <span className="text-slate-200">{item.condition}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-code">
                  <span className="text-emerald-300 flex items-center gap-1">
                    <span>✓</span> {item.sellerReg}
                  </span>
                  <a
                    href="https://delete-ruby.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4AF37] hover:underline font-semibold"
                  >
                    Inspect on Live App ↗
                  </a>
                </div>
              </div>
            ))}
          </div>

          {showLiveIframe && (
            <div className="rounded-xl overflow-hidden border border-[#D4AF37]/45 bg-black h-96 w-full">
              <iframe
                src="https://delete-ruby.vercel.app"
                title="VIT Campus Marketplace Live Deployment (delete-ruby.vercel.app)"
                className="w-full h-full border-0"
              />
            </div>
          )}
        </div>
      )}

      {/* TAB 1: GOOGLE CLOUD SKILLS BOOST ARCADE — 3 TIMED CHALLENGE LABS (100.0%) */}
      {activeTab === 'gcp' && (
        <div className="spotlight-card rounded-2xl p-6 sm:p-8 space-y-6 border-[#D4AF37]/40">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {GCP_CHALLENGE_LABS.map((lab, idx) => (
                <button
                  key={lab.id}
                  type="button"
                  onClick={() => setSelectedGcpLab(lab)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono-code border transition ${
                    selectedGcpLab.id === lab.id
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] font-bold shadow'
                      : 'bg-slate-950/90 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Lab 0{idx + 1}: {lab.title.split(':')[0]} ({lab.score})
                </button>
              ))}
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-xs font-mono-code font-bold text-emerald-300">
              ✓ Verified Score: {selectedGcpLab.score}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <div className="text-[11px] font-mono-code text-[#38BDF8]">
                  {selectedGcpLab.code}
                </div>
                <h4 className="font-cinzel text-lg sm:text-xl font-bold text-white mt-0.5">
                  {selectedGcpLab.title}
                </h4>
                <div className="text-xs font-mono-code text-[#D4AF37] mt-1">
                  {selectedGcpLab.domain}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono-code uppercase tracking-wider text-slate-400">
                  VERIFIED CHALLENGE LAB RUBRIC CHECKPOINTS
                </div>
                {selectedGcpLab.checkpoints.map((cp) => (
                  <div
                    key={cp}
                    className="p-3 rounded-xl bg-slate-950/85 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-slate-200"
                  >
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{cp}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedGcpLab.services.map((srv) => (
                  <span
                    key={srv}
                    className="px-2.5 py-1 rounded-lg bg-[#07080B] border border-[#38BDF8]/35 text-[11px] font-mono-code text-[#38BDF8]"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#D4AF37]">
                CLOUD SHELL (GCLOUD CLI) PROVISIONING TRACE
              </div>
              <pre className="p-4 rounded-xl bg-black/85 border border-slate-800 text-[11px] font-mono-code text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {selectedGcpLab.cliSnippet}
              </pre>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="https://go.cloudskillsboost.google/arcade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-[#07080B] font-mono-code text-xs font-bold hover:bg-amber-300 transition"
                >
                  Google Cloud Arcade ↗
                </a>
                <a
                  href="https://www.skills.google/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-slate-200 font-mono-code text-xs hover:bg-slate-800 transition"
                >
                  skills.google ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AEROPULSE ADS-B — 1090 MHZ FLIGHT TELEMETRY */}
      {activeTab === 'aeropulse' && (
        <div className="spotlight-card rounded-2xl p-6 sm:p-8 space-y-6 border-[#38BDF8]/35">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono-code text-[#38BDF8]">
                FLIGHTAWARE 1090 MHZ TRANSPONDER RECEIVER · VOBB (BHUBANESWAR) ↔ VOMM (CHENNAI/VELLORE)
              </div>
              <h4 className="font-cinzel text-lg font-bold text-white mt-0.5">
                AeroPulse ADS-B Live Corridor Telemetry Feed
              </h4>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono-code">
              <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400">
                ● 1090 MHz SDR LOCKED
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                FRAMES: <strong className="text-[#D4AF37]">{adsbPackets.toLocaleString()}</strong>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono-code">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-2.5 px-3">ICAO HEX</th>
                  <th className="py-2.5 px-3">CALLSIGN</th>
                  <th className="py-2.5 px-3">CORRIDOR ROUTE</th>
                  <th className="py-2.5 px-3">ALTITUDE</th>
                  <th className="py-2.5 px-3">GS (KTS)</th>
                  <th className="py-2.5 px-3">SQUAWK</th>
                  <th className="py-2.5 px-3">RSSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {aircraft.map((ac) => (
                  <tr key={ac.icao} className="hover:bg-slate-900/60 transition">
                    <td className="py-3 px-3 text-[#D4AF37] font-semibold">0x{ac.icao}</td>
                    <td className="py-3 px-3 text-white font-bold">{ac.callsign}</td>
                    <td className="py-3 px-3 text-slate-300">{ac.route}</td>
                    <td className="py-3 px-3 text-[#38BDF8]">{ac.altitudeFt.toLocaleString()} ft</td>
                    <td className="py-3 px-3 text-emerald-300">{ac.speedKts} kts</td>
                    <td className="py-3 px-3 text-slate-300">{ac.squawk}</td>
                    <td className="py-3 px-3 text-slate-400">{ac.rssiDbm} dBFS</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AQUACULTURE PATHOGENS & BIOACTIVE POLYSACCHARIDES MATRIX */}
      {activeTab === 'nanobiotech' && (
        <div className="spotlight-card rounded-2xl p-6 sm:p-8 space-y-6 border-emerald-400/35">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono-code text-emerald-400">
                CENTRE FOR NANOBIOTECHNOLOGY (VIT VELLORE) · GUIDE: DR. JOHN THOMAS
              </div>
              <h4 className="font-cinzel text-lg font-bold text-white mt-0.5">
                Bacterial Diseases in Aquaculture: Polysaccharide Extraction &amp; Bioactivity Matrix
              </h4>
            </div>
            <a
              href="https://drive.google.com/file/d/1rCYguV18uSwjeKbFRf5-ZPTMUkcXtkBi/view?usp=drivesdk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-[#07080B] font-mono-code text-xs font-bold hover:bg-amber-300 transition"
            >
              Open 22-Slide Review – I PDF ↗
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] font-mono-code text-[#D4AF37]">
                STAGE 01 // TARGET PATHOGENS (16S rRNA)
              </div>
              <div className="font-semibold text-white">
                Phenotypic, Biochemical &amp; 16S rRNA Profiling
              </div>
              <p className="text-slate-300 leading-relaxed italic">
                Vibrio harveyi, V. parahaemolyticus, V. anguillarum, Aeromonas hydrophila,
                Streptococcus iniae, Edwardsiella tarda.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] font-mono-code text-[#38BDF8]">
                STAGE 02 // POLYSACCHARIDE EXTRACTION
              </div>
              <div className="font-semibold text-white">
                FTIR · NMR · GC-MS · SEM/EDX Characterization
              </div>
              <p className="text-slate-300 leading-relaxed">
                Macroalgae, microalgae, fungi &amp; microbial EPS extracted via methanolic,
                ethanolic, hexanic, aqueous, and Celluclast enzyme-assisted methods.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] font-mono-code text-emerald-400">
                STAGE 03 // BIOACTIVITY EVALUATION
              </div>
              <div className="font-semibold text-white">
                MIC/MBC Antibacterial &amp; DPPH/ORAC/TEAC Assays
              </div>
              <p className="text-slate-300 leading-relaxed">
                Evaluates minimum inhibitory/bactericidal concentrations and antioxidant scavenging
                for prophylactic aquaculture feed &amp; water formulations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
