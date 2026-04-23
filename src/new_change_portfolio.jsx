import { useState, useEffect, useRef } from "react";

// ── Inject global CSS keyframes once ──────────────────────────
const injectGlobalStyles = () => {
  if (document.getElementById("pf-anim")) return;
  const s = document.createElement("style");
  s.id = "pf-anim";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes orbDrift1 {
      0%,100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(80px,-100px) scale(1.2); }
      66%      { transform: translate(-60px,60px) scale(0.85); }
    }
    @keyframes orbDrift2 {
      0%,100% { transform: translate(0,0) scale(1); }
      40%      { transform: translate(-90px,70px) scale(1.25); }
      70%      { transform: translate(60px,-50px) scale(0.8); }
    }
    @keyframes orbDrift3 {
      0%,100% { transform: translate(0,0) scale(1); }
      50%      { transform: translate(50px,90px) scale(1.15); }
    }
    @keyframes beamSweep {
      0%   { transform: translateX(-120%) skewX(-20deg); opacity:0; }
      5%   { opacity: 0.6; }
      95%  { opacity: 0.4; }
      100% { transform: translateX(500%) skewX(-20deg); opacity:0; }
    }
    @keyframes gridFade {
      0%,100% { opacity:0.35; }
      50%      { opacity:0.7; }
    }
    @keyframes starBlink {
      0%,100% { opacity:0.15; transform:scale(1); }
      50%      { opacity:1; transform:scale(1.6); }
    }
    @keyframes chipFloat {
      0%,100% { transform:translateY(0); }
      50%      { transform:translateY(-10px); }
    }
    @keyframes scanLine {
      0%   { top: -2px; }
      100% { top: 100%; }
    }
    .chip-a { animation: chipFloat 3.2s ease-in-out infinite; }
    .chip-b { animation: chipFloat 3.2s ease-in-out infinite 1.1s; }
    .chip-c { animation: chipFloat 3.2s ease-in-out infinite 2.1s; }

    input::placeholder, textarea::placeholder { color: rgba(232,232,240,0.28); }
    input:focus, textarea:focus {
      outline: none;
      border-color: rgba(108,99,255,0.55) !important;
      background: rgba(108,99,255,0.07) !important;
      box-shadow: 0 0 0 3px rgba(108,99,255,0.12);
    }
  `;
  document.head.appendChild(s);
};

// ============================================================
// ✏️  EDIT YOUR DATA HERE
// ============================================================
const DATA = {
  name: "Mehak",
  tagline: "Full Stack Developer & UI/UX Designer",
  bio: "a Frontend Developer and DSA enthusiast who loves building responsive, user-friendly web experiences. I enjoy solving complex problems and turning ideas into clean, efficient code.",
  email: "mehakrohilla27@gmail.com",
  github: "https://github.com/Mehak277",
  linkedin: "https://www.linkedin.com/in/mehak-rohilla-772553326/",

  // 📸 PHOTO — recommended size: 400×400 px (square), JPG or PNG, max ~200KB
  // Place your image in the /public folder and set path like "/me.jpg"
  photo: "/me.jpg",

  // 📄 Resume PDF — place in /public folder
  resumeLink: "#",

  skills: [
    { name: "React",             level: 92, category: "Frontend" },
    { name: "TypeScript",        level: 85, category: "Frontend" },
    { name: "Next.js",           level: 80, category: "Frontend" },
    { name: "Tailwind CSS",      level: 90, category: "Frontend" },
    { name: "Node.js",           level: 78, category: "Backend"  },
    { name: "PostgreSQL",        level: 70, category: "Backend"  },
    { name: "GraphQL",           level: 65, category: "Backend"  },
    { name: "Figma",             level: 88, category: "Design"   },
    { name: "UI/UX Design",      level: 82, category: "Design"   },
    { name: "Docker",            level: 60, category: "DevOps"   },
    { name: "Git",               level: 60, category: "Tools"    },
    { name: "GitHub",            level: 60, category: "Tools"    },
    { name: "Version Control",   level: 80, category: "Tools"    },
    { name: "Responsive Design", level: 40, category: "Design"   },
  ],

  projects: [
    {
      title: "EcoCart",
      description: "EcoCart is a sustainable shopping platform that helps users make eco-friendly purchasing decisions by tracking the environmental impact of their choices and promoting conscious consumption.",
      tags: ["Html","CSS","Javascript","AWS","Supabase","Node.js","Docker"],
      link: "https://github.com/Mehak277/ecocart",
      color: "#FF6B6B",
    },
    {
      title: "Recyclomania",
      description: "RecycloMania is a user-friendly platform that promotes smart recycling and environmental sustainability.",
      tags: ["HTML","CSS","JAVASCRIPT"],
      link: "https://github.com/Mehak277/RecycloMania",
      color: "#f1f91c",
    },
    {
      title: "Smart-Budget-Manager",
      description: "Smart Budget Manager helps users take control of their finances by tracking expenses and managing budgets with ease.",
      tags: ["Html","CSS","JavaScript"],
      link: "https://github.com/Mehak277/Smart-Budget-Manager",
      color: "#00C896",
    },
  ],
};
// ============================================================

const skillCategories = ["All", ...new Set(DATA.skills.map((s) => s.category))];

// ── Custom glowing cursor trail ───────────────────────────────
function CursorGlow() {
  const dotRef  = useRef(null);
  const glowRef = useRef(null);
  const mouse   = useRef({ x: -300, y: -300 });
  const glowPos = useRef({ x: -300, y: -300 });

  useEffect(() => {
    const st = document.createElement("style");
    st.id = "cursor-style";
    st.textContent = `
      * { cursor: none !important; }
      @keyframes trailFade { to { opacity:0; transform:scale(0); } }
    `;
    document.head.appendChild(st);

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      const trail = document.createElement("div");
      trail.style.cssText = `
        position:fixed; pointer-events:none; z-index:99998;
        width:6px; height:6px; border-radius:50%;
        background: radial-gradient(circle, rgba(108,99,255,0.9), rgba(0,200,150,0.5));
        left:${e.clientX - 3}px; top:${e.clientY - 3}px;
        animation: trailFade 0.6s ease forwards;
        box-shadow: 0 0 6px rgba(108,99,255,0.8);
      `;
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 620);
    };
    window.addEventListener("mousemove", onMove);

    let rafId;
    const animate = () => {
      glowPos.current.x += (mouse.current.x - glowPos.current.x) * 0.08;
      glowPos.current.y += (mouse.current.y - glowPos.current.y) * 0.08;
      if (dotRef.current) {
        dotRef.current.style.left = mouse.current.x - 4 + "px";
        dotRef.current.style.top  = mouse.current.y - 4 + "px";
      }
      if (glowRef.current) {
        glowRef.current.style.left = glowPos.current.x - 200 + "px";
        glowRef.current.style.top  = glowPos.current.y - 200 + "px";
      }
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      document.getElementById("cursor-style")?.remove();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: "fixed", zIndex: 99999, pointerEvents: "none",
        width: "8px", height: "8px", borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(108,99,255,0.8)",
      }} />
      <div ref={glowRef} style={{
        position: "fixed", zIndex: 99997, pointerEvents: "none",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, rgba(0,200,150,0.05) 50%, transparent 70%)",
        filter: "blur(30px)",
      }} />
    </>
  );
}

// ── Animated canvas particle background ──────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const PARTICLE_COUNT = 100;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      baseVx: 0, baseVy: 0,
      alpha: Math.random() * 0.5 + 0.15,
      hue: Math.random() > 0.6 ? 248 : Math.random() > 0.5 ? 160 : 280,
    }));
    particles.forEach(p => { p.baseVx = p.vx; p.baseVy = p.vy; });

    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const REPEL = 120;
        if (dist < REPEL && dist > 0) {
          const force = (REPEL - dist) / REPEL;
          p.vx += (dx / dist) * force * 1.5;
          p.vy += (dy / dist) * force * 1.5;
        }
        p.vx += (p.baseVx - p.vx) * 0.04;
        p.vy += (p.baseVy - p.vy) * 0.04;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(${particles[i].hue},80%,70%,${0.14 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nearBoost = dist < 150 ? (1 - dist / 150) * 0.6 : 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + nearBoost * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},90%,78%,${Math.min(1, p.alpha + nearBoost)})`;
        ctx.fill();
        if (nearBoost > 0.1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + nearBoost * 8, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue},90%,78%,${nearBoost * 0.15})`;
          ctx.fill();
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, zIndex: 0,
      pointerEvents: "none", display: "block",
    }} />
  );
}

// ── Main Portfolio ────────────────────────────────────────────
export default function Portfolio() {
  useEffect(() => { injectGlobalStyles(); }, []);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSection, setActiveSection] = useState("home");
  // ── track scroll to shrink/highlight nav ──
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredSkills =
    activeCategory === "All"
      ? DATA.skills
      : DATA.skills.filter((s) => s.category === activeCategory);

  return (
    <div style={s.root}>
      <CursorGlow />
      <ParticleCanvas />
      <div style={{ ...s.orb, ...s.orb1 }} />
      <div style={{ ...s.orb, ...s.orb2 }} />
      <div style={{ ...s.orb, ...s.orb3 }} />
      <div style={s.grid} />
      <div style={s.beam} />

      {/* ── Nav — FIXED ── */}
      <nav style={{
        ...s.nav,
        padding: scrolled ? "12px 60px" : "18px 60px",
        background: scrolled ? "rgba(7,7,16,0.97)" : "rgba(7,7,16,0.8)",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
      }}>
        <span style={s.navLogo}>
          {DATA.name.split(" ")[0]}<span style={s.dot}>.</span>
        </span>
        <div style={s.navLinks}>
          {["home", "skills", "projects", "contact"].map((sec) => (
            <button key={sec}
              style={{ ...s.navBtn, ...(activeSection === sec ? s.navBtnActive : {}) }}
              onClick={() => {
                setActiveSection(sec);
                document.getElementById(sec)?.scrollIntoView({ behavior: "smooth" });
              }}>
              {sec[0].toUpperCase() + sec.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* ── HERO — paddingTop accounts for fixed nav height ── */}
      <section id="home" style={s.hero}>
        <div style={s.heroLeft}>
          <p style={s.heroGreet}>👋 Hello, I'm</p>
          <h1 style={s.heroName}>{DATA.name}</h1>
          <h2 style={s.heroTagline}>{DATA.tagline}</h2>
          <p style={s.heroBio}>{DATA.bio}</p>
          <div style={s.heroButtons}>
            <button style={s.btnPrimary}
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
              View Projects →
            </button>
            <button style={s.btnSecondary}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
              Contact Me
            </button>
          </div>
        </div>

        <div style={s.heroRight}>
          <div style={s.photoRing}>
            <div style={s.photoInner}>
              <img src={DATA.photo} alt={DATA.name} style={s.photo} />
            </div>
            <div style={s.orbit} />
          </div>
          <div className="chip-a" style={{ ...s.floatChip, top:"8%",  right:"-12%" }}>⚡ React</div>
          <div className="chip-b" style={{ ...s.floatChip, bottom:"22%", left:"-14%" }}>🎨 Design</div>
          <div className="chip-c" style={{ ...s.floatChip, top:"54%",  right:"-16%" }}>🚀 Next.js</div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={s.section}>
        <SectionHeader label="What I Know" title="Skills & Expertise" />
        <div style={s.filterRow}>
          {skillCategories.map((cat) => (
            <button key={cat}
              style={{ ...s.filterBtn, ...(activeCategory === cat ? s.filterBtnActive : {}) }}
              onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <div style={s.skillsGrid}>
          {filteredSkills.map((skill) => <SkillCard key={skill.name} skill={skill} />)}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={s.section}>
        <SectionHeader label="My Work" title="Featured Projects" />
        <div style={s.projectsGrid}>
          {DATA.projects.map((p) => <ProjectCard key={p.title} project={p} />)}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={s.section}>
        <SectionHeader label="Get In Touch" title="Let's Work Together" />
        <div style={s.contactGrid}>
          <div style={s.contactLeft}>
            <p style={s.contactLeftSub}>
              Open to internships, freelance gigs, and collabs.<br />
              Drop a message or just say hi — I read everything. 👀
            </p>
            <div style={s.contactLinks}>
              {[
                { icon:"✉️", label:"Email",    val:DATA.email,    href:`mailto:${DATA.email}` },
                { icon:"🐙", label:"GitHub",   val:DATA.github,   href:DATA.github },
                { icon:"💼", label:"LinkedIn", val:DATA.linkedin, href:DATA.linkedin },
              ].map(({ icon, label, val, href }) => (
                <a key={label} href={href} style={s.contactLinkRow} target="_blank" rel="noreferrer">
                  <span style={s.contactLinkIcon}>{icon}</span>
                  <div>
                    <div style={s.contactLinkLabel}>{label}</div>
                    <div style={s.contactLinkVal}>{val}</div>
                  </div>
                </a>
              ))}
            </div>
            <a href={DATA.resumeLink} style={s.resumeBtn} download>⬇&nbsp; Download Resume</a>
          </div>
          <div style={s.contactFormCard}>
            <div style={s.formGlow} />
            <h3 style={s.formTitle}>Send a Message</h3>
            <ContactForm />
          </div>
        </div>
      </section>

      <footer style={s.footer}>
        <span>Built with ❤️ by {DATA.name}</span>
        <span style={{ opacity: 0.35 }}>© 2025</span>
      </footer>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────
function SectionHeader({ label, title }) {
  return (
    <div style={s.sectionHeader}>
      <span style={s.sectionLabel}>{label}</span>
      <h2 style={s.sectionTitle}>{title}</h2>
      <div style={s.sectionLine} />
    </div>
  );
}

function SkillCard({ skill }) {
  return (
    <div style={s.skillCard}>
      <div style={s.skillTop}>
        <span style={s.skillName}>{skill.name}</span>
        <span style={s.skillPct}>{skill.level}%</span>
      </div>
      <div style={s.skillBarBg}>
        <div style={{ ...s.skillBar, width: `${skill.level}%` }} />
      </div>
      <span style={s.skillCat}>{skill.category}</span>
    </div>
  );
}

function ProjectCard({ project }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={s.flipOuter} onClick={() => setFlipped(f => !f)}>
      <div style={{
        ...s.flipInner,
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* ── FRONT ── */}
        <div style={s.flipFace}>
          <div style={{ ...s.projectAccent, background: project.color }} />
          <div style={{ ...s.flipBigLetter, color: project.color }}>{project.title[0]}</div>
          <h3 style={s.projectTitle}>{project.title}</h3>
          <div style={s.projectTags}>
            {project.tags.map(t => (
              <span key={t} style={{ ...s.tag, borderColor: project.color, color: project.color }}>{t}</span>
            ))}
          </div>
          <div style={s.flipHint}>
            <span style={{ ...s.flipHintDot, background: project.color }} />
            Tap to see details
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={{ ...s.flipFace, ...s.flipBack }}>
          <div style={{
            position: "absolute", top: "-30%", right: "-20%",
            width: "260px", height: "260px", borderRadius: "50%",
            background: `radial-gradient(circle, ${project.color}22 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />
          <div style={{ ...s.projectAccent, background: project.color }} />
          <h3 style={{ ...s.projectTitle, marginBottom: "10px" }}>{project.title}</h3>
          <p style={s.projectDesc}>{project.description}</p>
          <div style={s.projectTags}>
            {project.tags.map(t => (
              <span key={t} style={{ ...s.tag, borderColor: project.color, color: project.color }}>{t}</span>
            ))}
          </div>
          <a href={project.link} style={{ ...s.projectLink, color: project.color, marginTop: "auto" }}
            onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer">
            View on GitHub →
          </a>
          <div style={s.flipHint}>
            <span style={{ ...s.flipHintDot, background: project.color }} />
            Tap to flip back
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [sent, setSent] = useState(false);
  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name:"", email:"", message:"" });
  };
  return (
    <div style={s.form}>
      <input style={s.formInput} placeholder="Your name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input style={s.formInput} placeholder="you@example.com" type="email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <textarea style={{ ...s.formInput, ...s.formTextarea }} placeholder="Tell me about your project..."
        value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      <button style={{ ...s.formSubmit, ...(sent ? s.formSubmitSent : {}) }} onClick={handleSubmit}>
        {sent ? "✓ Message Sent!" : "Send Message →"}
      </button>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const s = {
  root: {
    fontFamily: "'Sora', sans-serif",
    background: "#070710",
    color: "#E8E8F0",
    minHeight: "100vh",
    overflowX: "hidden",
    position: "relative",
  },

  orb: { position: "fixed", borderRadius: "50%", pointerEvents: "none", zIndex: 0, filter: "blur(80px)" },
  orb1: {
    width: "700px", height: "700px", top: "-200px", right: "-150px",
    background: "radial-gradient(circle, rgba(108,63,255,0.18) 0%, rgba(80,40,200,0.08) 50%, transparent 70%)",
    animation: "orbDrift1 18s ease-in-out infinite",
  },
  orb2: {
    width: "600px", height: "600px", bottom: "-100px", left: "-120px",
    background: "radial-gradient(circle, rgba(0,200,150,0.14) 0%, rgba(0,150,120,0.06) 50%, transparent 70%)",
    animation: "orbDrift2 22s ease-in-out infinite",
  },
  orb3: {
    width: "400px", height: "400px", top: "40%", left: "30%",
    background: "radial-gradient(circle, rgba(180,60,255,0.1) 0%, transparent 70%)",
    animation: "orbDrift3 28s ease-in-out infinite",
  },
  grid: {
    position: "fixed", inset: 0, zIndex: 0,
    backgroundImage: "linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)",
    backgroundSize: "44px 44px", pointerEvents: "none",
    animation: "gridFade 8s ease-in-out infinite",
  },
  beam: {
    position: "fixed", top: 0, left: "-40%", width: "30%", height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(108,99,255,0.04), transparent)",
    pointerEvents: "none", zIndex: 0, animation: "beamSweep 12s linear infinite",
  },

  // ── Nav — FIXED so it always stays on top while scrolling ──
  nav: {
    position: "fixed",        // ← changed from sticky to fixed
    top: 0, left: 0, right: 0,
    zIndex: 100,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    backdropFilter: "blur(24px)",
    borderBottom: "1px solid rgba(108,99,255,0.1)",
    transition: "padding 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
  },
  navLogo: { fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" },
  dot: { color: "#6C63FF" },
  navLinks: { display: "flex", gap: "6px" },
  navBtn: {
    background: "none", border: "none", color: "rgba(232,232,240,0.45)",
    fontSize: "14px", fontWeight: 500, padding: "8px 16px",
    borderRadius: "8px", cursor: "pointer", textTransform: "capitalize",
  },
  navBtnActive: { color: "#fff", background: "rgba(108,99,255,0.18)" },

  // ── Hero — paddingTop pushes content below the fixed nav ──
  hero: {
    position: "relative", zIndex: 1,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "160px 60px 80px",   // ← top padding = nav height (~70px) + original 100px
    maxWidth: "1200px", margin: "0 auto", gap: "60px",
  },
  heroLeft: { flex: 1 },
  heroGreet: { fontSize: "15px", color: "#7B72FF", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "14px" },
  heroName: { fontSize: "clamp(42px,5.5vw,72px)", fontWeight: 900, lineHeight: 1.04, letterSpacing: "-2.5px", color: "#fff", margin: "0 0 14px" },
  heroTagline: { fontSize: "clamp(15px,1.8vw,19px)", fontWeight: 400, color: "rgba(232,232,240,0.55)", margin: "0 0 22px" },
  heroBio: { fontSize: "15px", lineHeight: 1.85, color: "rgba(232,232,240,0.45)", maxWidth: "460px", marginBottom: "36px" },
  heroButtons: { display: "flex", gap: "14px", marginBottom: "48px", flexWrap: "wrap" },
  btnPrimary: {
    background: "linear-gradient(135deg, #6C63FF, #9B93FF)",
    color: "#fff", border: "none", padding: "14px 28px",
    borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer",
    boxShadow: "0 8px 30px rgba(108,99,255,0.35)",
  },
  btnSecondary: {
    background: "rgba(255,255,255,0.05)", color: "#E8E8F0",
    border: "1px solid rgba(255,255,255,0.1)", padding: "14px 28px",
    borderRadius: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer",
  },

  heroRight: {
    position: "relative", flex: "0 0 320px",
    display: "flex", justifyContent: "center", alignItems: "center",
  },
  photoRing: { position: "relative", width: "280px", height: "280px" },
  photoInner: {
    width: "280px", height: "280px",
    borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
    overflow: "hidden",
    border: "2px solid rgba(108,99,255,0.45)",
    boxShadow: "0 0 80px rgba(108,99,255,0.3), 0 0 40px rgba(0,200,150,0.1)",
  },
  photo: { width: "100%", height: "100%", objectFit: "cover" },
  orbit: {
    position: "absolute", inset: "-20px", borderRadius: "50%",
    border: "1px dashed rgba(108,99,255,0.25)",
    animation: "orbDrift3 20s linear infinite", pointerEvents: "none",
  },
  floatChip: {
    position: "absolute", background: "rgba(12,12,22,0.92)",
    border: "1px solid rgba(255,255,255,0.1)", color: "#E8E8F0",
    fontSize: "12px", fontWeight: 700, padding: "8px 14px", borderRadius: "10px",
    backdropFilter: "blur(12px)", boxShadow: "0 4px 20px rgba(0,0,0,0.5)", whiteSpace: "nowrap",
  },

  section: {
    position: "relative", zIndex: 1,
    maxWidth: "1200px", margin: "0 auto", padding: "80px 60px",
  },
  sectionHeader: { textAlign: "center", marginBottom: "60px" },
  sectionLabel: { fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#6C63FF" },
  sectionTitle: { fontSize: "clamp(28px,3vw,44px)", fontWeight: 900, color: "#fff", margin: "10px 0 16px", letterSpacing: "-1px" },
  sectionLine: { width: "56px", height: "3px", background: "linear-gradient(90deg,#6C63FF,transparent)", borderRadius: "2px", margin: "0 auto" },

  filterRow: { display: "flex", gap: "10px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap" },
  filterBtn: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
    color: "rgba(232,232,240,0.5)", padding: "8px 20px", borderRadius: "20px",
    fontSize: "13px", fontWeight: 600, cursor: "pointer",
  },
  filterBtnActive: { background: "rgba(108,99,255,0.18)", border: "1px solid rgba(108,99,255,0.5)", color: "#9B93FF" },
  skillsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: "16px" },
  skillCard: {
    background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px", padding: "20px 24px",
  },
  skillTop: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  skillName: { fontSize: "15px", fontWeight: 700, color: "#E8E8F0" },
  skillPct: { fontSize: "13px", fontWeight: 700, color: "#6C63FF" },
  skillBarBg: { height: "5px", background: "rgba(255,255,255,0.07)", borderRadius: "3px", overflow: "hidden", marginBottom: "10px" },
  skillBar: { height: "100%", background: "linear-gradient(90deg,#6C63FF,#9B93FF)", borderRadius: "3px" },
  skillCat: { fontSize: "11px", fontWeight: 700, color: "rgba(232,232,240,0.3)", textTransform: "uppercase", letterSpacing: "1px" },

  // ── Flip card ──
  projectsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "24px" },
  flipOuter: { perspective: "1000px", height: "280px", cursor: "pointer" },
  flipInner: {
    position: "relative", width: "100%", height: "100%",
    transformStyle: "preserve-3d",
    transition: "transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)",
  },
  flipFace: {
    position: "absolute", inset: 0,
    backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
    background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "20px", padding: "28px", overflow: "hidden",
    display: "flex", flexDirection: "column", gap: "12px",
  },
  flipBack: {
    transform: "rotateY(180deg)",
    background: "rgba(14,12,28,0.97)", border: "1px solid rgba(255,255,255,0.1)",
  },
  flipBigLetter: {
    fontSize: "72px", fontWeight: 900, lineHeight: 1,
    opacity: 0.12, letterSpacing: "-4px", userSelect: "none",
  },
  flipHint: {
    marginTop: "auto", display: "flex", alignItems: "center", gap: "6px",
    fontSize: "11px", fontWeight: 600, color: "rgba(232,232,240,0.3)", letterSpacing: "0.5px",
  },
  flipHintDot: { width: "6px", height: "6px", borderRadius: "50%", display: "inline-block", opacity: 0.8 },
  projectAccent: { position: "absolute", top: 0, left: 0, right: 0, height: "3px", borderRadius: "20px 20px 0 0" },
  projectTitle: { fontSize: "20px", fontWeight: 800, color: "#fff", margin: 0 },
  projectDesc: { fontSize: "14px", lineHeight: 1.75, color: "rgba(232,232,240,0.55)", margin: 0 },
  projectTags: { display: "flex", flexWrap: "wrap", gap: "6px" },
  tag: { fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px", border: "1px solid", background: "rgba(255,255,255,0.03)", letterSpacing: "0.5px" },
  projectLink: { fontSize: "13px", fontWeight: 700, textDecoration: "none", letterSpacing: "0.3px" },

  contactGrid: { display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "40px", alignItems: "start" },
  contactLeft: { display: "flex", flexDirection: "column", gap: "30px" },
  contactLeftSub: { fontSize: "16px", lineHeight: 1.9, color: "rgba(232,232,240,0.52)" },
  contactLinks: { display: "flex", flexDirection: "column", gap: "14px" },
  contactLinkRow: {
    display: "flex", alignItems: "center", gap: "16px", padding: "14px 18px",
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px", textDecoration: "none", cursor: "pointer",
  },
  contactLinkIcon: {
    fontSize: "20px", width: "42px", height: "42px",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(108,99,255,0.12)", borderRadius: "10px", flexShrink: 0,
  },
  contactLinkLabel: { fontSize: "10px", fontWeight: 700, color: "rgba(232,232,240,0.38)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "3px" },
  contactLinkVal: { fontSize: "14px", fontWeight: 600, color: "#E8E8F0" },
  resumeBtn: {
    display: "inline-block", background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.32)",
    color: "#9B93FF", padding: "14px 28px", borderRadius: "12px",
    fontSize: "14px", fontWeight: 700, textDecoration: "none", textAlign: "center", cursor: "pointer",
  },
  contactFormCard: {
    position: "relative", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px", padding: "36px", overflow: "hidden",
  },
  formGlow: {
    position: "absolute", top: "-40%", right: "-30%", width: "300px", height: "300px", borderRadius: "50%",
    background: "radial-gradient(circle,rgba(108,99,255,0.12) 0%,transparent 70%)", pointerEvents: "none",
  },
  formTitle: { fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 0 24px", letterSpacing: "-0.5px" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  formInput: {
    background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "12px", padding: "14px 18px", color: "#E8E8F0",
    fontSize: "14px", fontFamily: "inherit", outline: "none", resize: "none",
    transition: "border-color 0.2s, background 0.2s",
  },
  formTextarea: { minHeight: "118px", resize: "vertical" },
  formSubmit: {
    background: "linear-gradient(135deg,#6C63FF,#9B93FF)", color: "#fff", border: "none",
    borderRadius: "12px", padding: "15px", fontSize: "15px", fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.3px",
    boxShadow: "0 6px 24px rgba(108,99,255,0.35)",
  },
  formSubmitSent: { background: "linear-gradient(135deg,#00C896,#009F74)", boxShadow: "0 6px 24px rgba(0,200,150,0.35)" },

  footer: {
    position: "relative", zIndex: 1,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "24px 60px", borderTop: "1px solid rgba(255,255,255,0.05)",
    fontSize: "13px", color: "rgba(232,232,240,0.38)",
  },
};
