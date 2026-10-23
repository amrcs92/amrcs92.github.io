import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Content } from "@/content/types";
import { NanoField } from "@/components/NanoField";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WorkGallery } from "@/components/WorkGallery";
import { HeroType } from "@/components/HeroType";
import { ArrowIcon, CodeIcon, DownloadIcon, ExternalIcon, MailIcon, PersonIcon } from "@/components/icons";
import { asset, links, projectLinks, shotNames, shotSize, type ProjectId } from "@/site.config";

/** Both theme variants render; CSS shows the one matching the active theme. Screens always match the page language. */
function Shot({ id, i, lang, label, name }: { id: ProjectId; i: 0 | 1; lang: string; label: string; name: string }) {
  const [w, h] = shotSize[id];
  return (["light", "dark"] as const).map((theme) => (
    // eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized PNGs
    <img key={theme} className={`shot-${theme}`} src={asset(`/screenshots/${id}-${lang}-${theme}-${shotNames[id][i]}.png`)}
      width={w} height={h} alt={`${name} — ${label}`} loading="lazy" decoding="async" />
  ));
}

function SectionHead({ slug, sub }: { slug: string; sub?: string }) {
  return (
    <header className="cn-sh">
      <h2><span>~/</span>{slug}</h2>
      <p>{sub ? `# ${sub}` : ""}</p>
    </header>
  );
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const c = (await getMessages()) as unknown as Content;
  const h = c.hero;
  const ar = locale === "ar";
  const nav: [string, string][] = [["work", c.nav.work], ["ai", c.nav.ai], ["exp", c.nav.exp], ["skills", c.nav.skills], ["contact", c.nav.contact]];

  return (
    <div className="cn">
      <NanoField />
      <a className="skip" href="#main">{ar ? "تخطَّ إلى المحتوى" : "Skip to content"}</a>
      <header className="cn-h">
        <div className="wrap">
          <a className="cn-logo" href="#main"><b>&gt;</b> amr<span className="mut">.serag</span></a>
          <nav className="cn-nav" aria-label="Primary">
            {nav.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>
          <div className="cn-tgs">
            {/* Full page load on purpose: each locale has its own <html lang dir>, and the theme script reruns. */}
            <a className="tg" href={asset(`/${c.otherCode}/`)} hrefLang={c.otherCode} lang={c.otherCode} aria-label={c.ui.langAria}>
              <span className="k">lang:</span>{ar ? "en" : "ar"}
            </a>
            <ThemeToggle toDark={c.ui.toDark} toLight={c.ui.toLight} />
          </div>
        </div>
      </header>

      <main id="main">
        <div className="wrap">
          <section className="cn-hero">
            <div>
              <p className="cn-prompt" dir="ltr"><span>amr@egypt</span>:<span className="acc">~$ whoami</span></p>
              <HeroType name={h.name} title={h.title} line={h.line} />
              <div className="cn-ctas">
                <a className="cn-btn pri" href={links.cv} download><DownloadIcon />{h.cv}</a>
                <a className="cn-btn" href={links.github} target="_blank" rel="noopener noreferrer"><CodeIcon />{h.github}<ExternalIcon /></a>
                <a className="cn-btn" href="#contact"><MailIcon />{h.contact}</a>
              </div>
            </div>
            <aside className="panel cn-kv" aria-label="Summary">
              <div className="cn-kv-h"><span>profile.json</span><span>/{locale}</span></div>
              <dl>
                <dt>{c.ui.role}</dt><dd>{h.title}</dd>
                <dt>{c.ui.based}</dt><dd>{h.location}</dd>
                <dt>{c.ui.exp}</dt><dd>{h.years}</dd>
                <dt>{c.ui.stack}</dt><dd dir="ltr" style={{ textAlign: "start" }}>{h.stack}</dd>
                <dt>{c.ui.langs}</dt><dd>{h.langs}</dd>
                <dt>{c.ui.status}</dt><dd><span className="cn-dot" />{h.status}</dd>
              </dl>
            </aside>
          </section>

          <section className="cn-sec" id="work">
            <SectionHead slug="work" sub={c.work.kicker} />
            <p className="cn-intro">{c.work.intro}</p>
            <div className="panel cn-crew">
              <p className="cn-crew-h mono" dir="ltr"><span className="acc">$</span> {c.work.crew.cmd}</p>
              <dl>
                {c.work.crew.rows.map(([who, what]) => (
                  <div key={who}><dt className="mono">{who}</dt><dd>{what}</dd></div>
                ))}
              </dl>
            </div>
            {c.projects.map((p) => {
              const pl = projectLinks[p.id];
              return (
                <article key={p.id} className="panel cn-repo" style={{ ["--brand" as string]: `var(--brand-${p.id})` }}>
                  <div className="cn-repo-h">
                    {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
                    <img src={asset(`/apps/${p.id}.png`)} alt="" width={26} height={26} />
                    <span className="path" dir="ltr">amrcs92/<b>{p.id}</b></span>
                    <span className="st"><span className="cn-dot" />{p.status}</span>
                  </div>
                  <div className="cn-repo-b">
                    <div className="cn-shots">
                      <Shot id={p.id} i={0} lang={locale} label={p.shots[0]} name={p.name} />
                      <Shot id={p.id} i={1} lang={locale} label={p.shots[1]} name={p.name} />
                    </div>
                    <div className="cn-info">
                      <h3>{p.name}<span lang={c.otherCode}>{p.alt}</span></h3>
                      <p className="cn-tagline">{p.tagline}</p>
                      <p>{p.desc}</p>
                      <ul className="cn-tags" aria-label={c.ui.built} dir="ltr">
                        {p.tags.map((t) => <li key={t}>{t}</li>)}
                      </ul>
                      <p className="cn-comment">{"// "}<b>{c.ui.how}:</b> {p.how}</p>
                      <div className="cn-ctas">
                        <a className="cn-btn pri" href={pl.apk}><DownloadIcon />{pl.kind === "exe" ? c.ui.exe : c.ui.apk}</a>
                        {pl.view && (
                          <a className="cn-btn" href={pl.view[locale as "en" | "ar"]} target="_blank" rel="noopener noreferrer">{pl.code ? c.ui.code : c.ui.view}{pl.code ? <ExternalIcon /> : <ArrowIcon />}</a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="cn-sec" id="ai">
            <SectionHead slug="ai-workflow" sub={c.ai.title} />
            <p className="cn-intro" style={{ color: "var(--cn-ink)", fontSize: 19 }}>{c.ai.lead}</p>
            <ol className="cn-pipe">
              {c.ai.steps.map((s, i) => (
                <li key={s.t} className="panel">
                  <span className="n">step {i + 1}/5</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                  <span className="tool">$ {s.tool}</span>
                </li>
              ))}
            </ol>
            <p className="panel cn-note"><b>{c.ai.noteTitle}:</b> {c.ai.note}</p>
          </section>

          <section className="cn-sec" id="exp">
            <SectionHead slug="experience" sub={c.exp.title} />
            <ol className="cn-log">
              {c.exp.items.map((j, i) => (
                <li key={j.org}>
                  <div className="cn-commit">
                    {i === 0 && <span className="cn-head">HEAD →</span>}
                    <span>{j.from} – {j.to}</span>
                  </div>
                  <h3>{j.role}</h3>
                  <p className="cn-org">{j.org}</p>
                  {j.points.length > 0 && (
                    <ul className="cn-diff">{j.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  )}
                  {j.gallery && <WorkGallery g={j.gallery} dir="monglish-edulixa360" />}
                </li>
              ))}
            </ol>
          </section>

          <section className="cn-sec" id="skills">
            <SectionHead slug="skills" sub={c.skills.title} />
            <div className="cn-skills">
              {c.skills.groups.map((g, i) => (
                <div key={g} className="panel">
                  <h3>{g}</h3>
                  <ul dir="ltr">{c.skills.items[i].map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
              ))}
            </div>
          </section>

          <section className="cn-sec" id="education">
            <SectionHead slug="education" sub={c.edu.title} />
            <div className="cn-edu">
              {c.edu.items.map((e) => (
                <div key={e.degree} className="panel">
                  <span className="y">{e.year}</span>
                  <b>{e.degree}</b>
                  <span className="mut">{e.school}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="cn-contact" id="contact">
        <div className="wrap">
          <SectionHead slug="contact" sub={c.contact.kicker} />
          <h2 className="cn-contact-title">{c.contact.title}</h2>
          <p className="mut" style={{ margin: "10px 0 0" }}>{c.contact.line}</p>
          <div className="panel cn-cmd" dir="ltr"><span className="mut">$</span> mail <a href={links.email}>{links.emailText}</a></div>
          <div className="cn-ctas">
            <a className="cn-btn pri" href={links.email}><MailIcon />{c.contact.cta}</a>
            <a className="cn-btn" href={links.github} target="_blank" rel="noopener noreferrer"><CodeIcon />GitHub</a>
            <a className="cn-btn" href={links.linkedin} target="_blank" rel="noopener noreferrer"><PersonIcon />LinkedIn</a>
          </div>
          <div className="cn-foot"><span>{c.footer.rights}</span><span>{c.footer.built}</span></div>
        </div>
      </footer>
    </div>
  );
}
