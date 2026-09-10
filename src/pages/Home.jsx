import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Cloud, Radar, Satellite, Cpu, Waves, Map, ShieldAlert, Bell, Activity, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';

gsap.registerPlugin(ScrollTrigger);

const HERO_VIDEO = 'https://customer-assets-lqy194kg.emergentagent.net/job_flood-predict-india/artifacts/rhhzcvka_63343-506377529.mp4';

export default function Home() {
  const heroRef = useRef(null);
  const dataFlowRef = useRef(null);
  const [rain, setRain] = React.useState(120);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-tag', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.hero-title > span', { y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 });
      gsap.from('.hero-sub', { y: 20, opacity: 0, duration: 0.9, delay: 0.7, ease: 'power2.out' });
      gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.8, delay: 0.9, stagger: 0.1, ease: 'power2.out' });

      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 40, opacity: 0, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });

      gsap.utils.toArray('.count').forEach((el) => {
        const target = +el.dataset.count;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.6, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.floor(obj.v).toLocaleString('en-IN'); },
          scrollTrigger: { trigger: el, start: 'top 90%' },
        });
      });

      gsap.from('.flow-step', {
        opacity: 0, x: -20, duration: 0.6, stagger: 0.15,
        scrollTrigger: { trigger: dataFlowRef.current, start: 'top 75%' },
      });
    });
    return () => mm.revert();
  }, []);

  const inundationArea = Math.round(60 + rain * 1.6);
  const floodProb = Math.min(98, Math.round(20 + rain * 0.35));

  return (
    <div className="bg-white">
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen h-screen flex items-center overflow-hidden bg-slate-950" style={{ minHeight: '100vh', height: '100vh' }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src="/hero-video.mp4" type="video/mp4"/>
          <source src={HERO_VIDEO} type="video/mp4"/>
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-slate-950/80 pointer-events-none"/>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(2,132,199,0.25),transparent_60%)] pointer-events-none"/>

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-12 w-full flex-1 flex flex-col justify-center">
          <div className="max-w-4xl">
            <div className="hero-tag inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 text-white/90 text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] mb-4 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5 text-sky-300"/> AI-POWERED FLOOD INTELLIGENCE
            </div>
            <h1 className="hero-title text-white font-serif tracking-tight leading-[1.06]" style={{ fontFamily: "'Fraunces', serif" }}>
              <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-semibold">Predict the Rain.</span>
              <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-semibold">Understand the Flood.</span>
              <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-semibold text-sky-300">Protect What Matters.</span>
            </h1>
            <p className="hero-sub mt-4 sm:mt-6 text-white/85 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed font-normal">
              HydroSense AI combines weather, radar, satellite, NWP, terrain and geospatial information to predict heavy rainfall,
              estimate inundation and support faster disaster-response decisions.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link to="/dashboard">
                <Button size="lg" className="hero-cta bg-white text-slate-950 hover:bg-slate-100 h-11 sm:h-12 px-6 rounded-full font-semibold text-sm shadow-lg w-full sm:w-auto">
                  Launch Command Center <ArrowRight className="w-4 h-4 ml-2"/>
                </Button>
              </Link>
              <a href="#story">
                <Button size="lg" variant="outline" className="hero-cta h-11 sm:h-12 px-6 rounded-full border border-white/25 text-white bg-white/5 hover:bg-white/15 hover:text-white backdrop-blur-sm font-medium text-sm w-full sm:w-auto">
                  Explore Platform
                </Button>
              </a>
            </div>
            <div className="hero-cta mt-6 sm:mt-8 text-[11px] sm:text-xs text-white/60 tracking-wider">
              — Illustrative flood footage • India-wide GIS platform
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-8 z-10 hidden md:flex items-center gap-2.5 text-white/70 text-[11px] tracking-widest font-medium">
          SCROLL TO EXPLORE <span className="inline-block w-8 h-[1px] bg-white/40"/>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="story" className="py-24 border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4 reveal">
            <div className="text-[11px] font-semibold text-sky-700 tracking-[0.18em] mb-3">01 — THE PROBLEM</div>
            <h2 className="font-serif text-4xl md:text-5xl text-slate-900 leading-tight">Rainfall is measured.<br/>Floods are missed.</h2>
          </div>
          <div className="md:col-span-7 md:col-start-6 reveal">
            <p className="text-lg text-slate-700 leading-relaxed">
              Fragmented weather, radar, satellite, NWP and GIS information makes it difficult to understand
              <span className="text-slate-900 font-medium"> where rainfall will actually cause flooding</span> — and how severe it will be.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[{n:'42%',l:'annual monsoon variability'},{n:'₹ 87Kcr',l:'yearly flood damages'},{n:'6.8Cr',l:'people impacted / year'}].map((k,i) => (
                <div key={i} className="border-l-2 border-sky-500 pl-4">
                  <div className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">{k.n}</div>
                  <div className="text-xs text-slate-500 mt-1">{k.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DATA FUSION */}
      <section ref={dataFlowRef} className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="reveal text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] font-semibold text-sky-700 tracking-[0.18em] mb-3">02 — MULTI-SOURCE DATA FUSION</div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-tight">One brain. Every signal.</h2>
            <p className="mt-4 text-slate-600">Weather + Radar + Satellite + NWP + Terrain + Historical converge into a single intelligence layer.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-10">
            {[
              { Icon: Cloud, label: 'Weather' },
              { Icon: Radar, label: 'Radar' },
              { Icon: Satellite, label: 'Satellite' },
              { Icon: Cpu, label: 'NWP' },
              { Icon: Map, label: 'Terrain' },
              { Icon: Activity, label: 'Historical' },
            ].map(({Icon,label},i) => (
              <div key={i} className="flow-step bg-white border border-slate-200 rounded-lg p-4 flex flex-col items-center gap-2 hover:border-sky-300 hover:shadow-sm transition">
                <Icon className="w-6 h-6 text-sky-700" strokeWidth={1.8}/>
                <div className="text-xs font-medium text-slate-700">{label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center reveal">
            <div className="h-8 w-[2px] bg-gradient-to-b from-transparent to-sky-500"/>
            <div className="px-6 py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold tracking-wider flex items-center gap-2">
              <Waves className="w-4 h-4 text-sky-300"/> HYDROSENSE AI
            </div>
            <div className="h-8 w-[2px] bg-gradient-to-b from-sky-500 to-transparent"/>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 w-full">
              {['Rainfall Forecast','Inundation Map','Risk Score','Actionable Alerts'].map((o,i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-lg p-3 text-center text-xs font-medium text-slate-700">{o}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="reveal mb-12">
            <div className="text-[11px] font-semibold text-sky-700 tracking-[0.18em] mb-3">03 — HOW IT WORKS</div>
            <h2 className="font-serif text-4xl md:text-5xl text-slate-900 leading-tight max-w-3xl">Observe. Predict. Act.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-6">
            {[
              { n: '01', t: 'Observe', d: 'Ingest live weather, radar, satellite & station data across India.' },
              { n: '02', t: 'Predict', d: 'AI-driven rainfall forecasting at high spatial resolution.' },
              { n: '03', t: 'Model Inundation', d: 'Terrain + hydrology models estimate flood extent.' },
              { n: '04', t: 'Assess Risk', d: 'Overlay hazard, exposure, vulnerability for risk zones.' },
              { n: '05', t: 'Simulate', d: 'What-if scenarios for rainfall, drainage & saturation.' },
              { n: '06', t: 'Alert', d: 'Location-specific alerts by severity and impact area.' },
              { n: '07', t: 'Act', d: 'Guide district-level response with confidence-rated intel.' },
            ].map((s, i) => (
              <div key={i} className="reveal flex gap-5 py-4 border-b border-slate-100 last:border-0">
                <div className="font-serif text-2xl text-sky-600 tabular-nums font-semibold">{s.n}</div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">{s.t}</div>
                  <div className="text-sm text-slate-600 mt-1">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RAINFALL TO CONSEQUENCES */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="reveal max-w-2xl mb-12">
            <div className="text-[11px] font-semibold text-sky-300 tracking-[0.18em] mb-3">04 — FROM RAINFALL TO CONSEQUENCES</div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">Beyond the forecast.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="reveal rounded-xl border border-slate-700 p-8 bg-slate-800/50">
              <div className="text-[10px] font-semibold text-slate-400 tracking-[0.18em] mb-3">TRADITIONAL</div>
              <div className="font-serif text-3xl leading-tight text-slate-300">“Heavy rainfall expected.”</div>
              <div className="mt-6 text-sm text-slate-500">Broadcast • general • not actionable</div>
            </div>
            <div className="reveal rounded-xl border border-sky-500/40 p-8 bg-gradient-to-br from-sky-950/50 to-slate-800/50">
              <div className="text-[10px] font-semibold text-sky-300 tracking-[0.18em] mb-3">HYDROSENSE AI</div>
              <ul className="space-y-3 font-serif text-2xl leading-snug">
                <li>Where will flooding occur?</li>
                <li>What could be affected?</li>
                <li>How severe could it become?</li>
                <li className="text-sky-300">What if rainfall increases?</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* INUNDATION MODELING */}
      <section className="py-24 border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 reveal">
            <div className="text-[11px] font-semibold text-sky-700 tracking-[0.18em] mb-3">05 — INUNDATION DYNAMICS</div>
            <h2 className="font-serif text-4xl md:text-5xl text-slate-900 leading-tight">Rainfall to river basin inundation.</h2>
            <p className="mt-4 text-slate-600">Calculates hydrological runoff, soil saturation, and digital elevation models to project inundation extent and risk levels.</p>
            <Link to="/inundation" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-sky-700 hover:text-sky-900">
              Launch Inundation Predictor <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>
          <div className="md:col-span-7 reveal">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-baseline justify-between mb-2">
                <label className="text-[11px] font-semibold text-slate-600 tracking-[0.14em]">24H RAINFALL THRESHOLD</label>
                <div className="text-sm font-semibold text-slate-900 tabular-nums">{rain} mm</div>
              </div>
              <Slider min={0} max={300} step={5} value={[rain]} onValueChange={(v) => setRain(v[0])}/>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 tracking-[0.14em]">FLOOD PROB.</div>
                  <div className="text-3xl font-semibold text-slate-900 tabular-nums mt-1">{floodProb}%</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 tracking-[0.14em]">INUNDATION</div>
                  <div className="text-3xl font-semibold text-slate-900 tabular-nums mt-1">{inundationArea} <span className="text-sm text-slate-500">km²</span></div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 tracking-[0.14em]">RISK</div>
                  <div className={`text-2xl font-semibold mt-1 ${floodProb > 80 ? 'text-red-600' : floodProb > 55 ? 'text-orange-600' : floodProb > 25 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {floodProb > 80 ? 'CRITICAL' : floodProb > 55 ? 'HIGH' : floodProb > 25 ? 'MODERATE' : 'LOW'}
                  </div>
                </div>
              </div>
              <div className="mt-6 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-500" style={{ width: `${floodProb}%` }}/>
              </div>
              <div className="mt-3 text-[10px] text-emerald-700 font-semibold tracking-wider">AI HYDRODYNAMIC SOLVER • LIVE FEED</div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="reveal text-center max-w-2xl mx-auto mb-12">
            <div className="text-[11px] font-semibold text-sky-700 tracking-[0.18em] mb-3">06 — IMPACT</div>
            <h2 className="font-serif text-4xl md:text-5xl text-slate-900 leading-tight">Built for decisions that save lives.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { Icon: TrendingUp, t: 'Earlier warning', d: 'Hours of lead time before flooding.' },
              { Icon: Map, t: 'Location-specific risk', d: 'Ward-level flood zones.' },
              { Icon: ShieldAlert, t: 'Infrastructure aware', d: 'Hospitals, roads, bridges flagged.' },
              { Icon: Cpu, t: 'Data-driven decisions', d: 'Confidence-rated intelligence.' },
            ].map(({Icon,t,d},i) => (
              <div key={i} className="reveal bg-white border border-slate-200 rounded-lg p-5 hover:shadow-sm transition">
                <Icon className="w-6 h-6 text-sky-700 mb-3" strokeWidth={1.8}/>
                <div className="font-semibold text-slate-900">{t}</div>
                <div className="text-sm text-slate-600 mt-1">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-24 border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="reveal mb-10">
            <div className="text-[11px] font-semibold text-sky-700 tracking-[0.18em] mb-3">07 — USE CASES</div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-tight max-w-3xl">One platform. Many command rooms.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {['District Administration','Disaster Management','Municipalities','Emergency Response','Infrastructure Operators'].map((u,i) => (
              <div key={i} className="reveal border border-slate-200 rounded-lg p-5 hover:border-sky-300 hover:bg-sky-50/30 transition">
                <div className="text-sky-700 text-xs font-semibold tracking-wider">0{i+1}</div>
                <div className="mt-2 font-semibold text-slate-900">{u}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 bg-gradient-to-b from-white to-sky-50">
        <div className="max-w-4xl mx-auto px-6 text-center reveal">
          <div className="text-[11px] font-semibold text-sky-700 tracking-[0.18em] mb-4 flex items-center justify-center gap-2">
            <Bell className="w-3.5 h-3.5"/> READY WHEN THE MONSOON ISN'T
          </div>
          <h2 className="font-serif text-4xl md:text-6xl text-slate-900 leading-[1.05] tracking-tight">
            Turn Flood Forecasts<br/>Into <span className="text-sky-600">Flood Intelligence</span>.
          </h2>
          <div className="mt-10">
            <Link to="/dashboard">
              <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 h-12 px-8">
                Launch Command Center <ArrowRight className="w-4 h-4 ml-2"/>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
