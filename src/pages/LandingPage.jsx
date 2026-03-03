import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'

/* ————— Intersection Observer Hook ————— */
function useInView(options = {}) {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setVisible(true); obs.unobserve(el) }
        }, { threshold: 0.15, ...options })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])
    return [ref, visible]
}

function FadeIn({ children, className = '', delay = 0 }) {
    const [ref, visible] = useInView()
    return (
        <div ref={ref} className={`fade-in ${visible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    )
}

/* ————— FAQ Item ————— */
function FaqItem({ question, answer }) {
    const [open, setOpen] = useState(false)
    return (
        <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
            <button className="faq-item__question" onClick={() => setOpen(!open)} aria-expanded={open}>
                <span>{question}</span>
                <span className="faq-item__icon">+</span>
            </button>
            <div className="faq-item__answer" role="region">
                <p>{answer}</p>
            </div>
        </div>
    )
}

/* ————— Contact Form ————— */
function ContactForm() {
    const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
    const [status, setStatus] = useState('idle') // idle | sending | sent | error

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('sending')
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (res.ok) {
                setStatus('sent')
                setForm({ name: '', email: '', company: '', message: '' })
            } else {
                setStatus('error')
            }
        } catch {
            setStatus('error')
        }
    }

    if (status === 'sent') {
        return (
            <div className="form-success">
                ✓ Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns innerhalb von 24 Stunden bei Ihnen.
            </div>
        )
    }

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="contact-name">Name *</label>
                <input id="contact-name" type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ihr vollständiger Name" />
            </div>
            <div className="form-group">
                <label htmlFor="contact-email">E-Mail *</label>
                <input id="contact-email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="ihre@email.de" />
            </div>
            <div className="form-group">
                <label htmlFor="contact-company">Unternehmen</label>
                <input id="contact-company" type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Firmenname" />
            </div>
            <div className="form-group">
                <label htmlFor="contact-message">Nachricht *</label>
                <textarea id="contact-message" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Wie können wir Ihnen bei KI Werbung helfen?" rows={5} />
            </div>
            <button type="submit" className="btn btn--primary form-submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Wird gesendet…' : 'Kostenlose Beratung anfordern →'}
            </button>
            {status === 'error' && (
                <p style={{ color: 'var(--color-light-orange)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    Ein Fehler ist aufgetreten. Bitte senden Sie Ihre Anfrage an <a href="mailto:info@famefact.com">info@famefact.com</a>.
                </p>
            )}
        </form>
    )
}

/* ————— MAIN LANDING PAGE ————— */
export default function LandingPage() {
    return (
        <>
            <Helmet>
                <title>KI Werbung Berlin | AI Ads Beratung & KI-Werbekampagnen | famefact</title>
                <meta name="description" content="KI Werbung Berlin – Ihre Experten für KI-gestützte Werbekampagnen, ChatGPT Ads & AI Advertising. Strategische Beratung für KI Werbung in Berlin. ✓ Früher Marktzugang ✓ Nachweisbare Ergebnisse" />
            </Helmet>

            {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
            <section className="hero" id="hero">
                <div className="hero__bg" aria-hidden="true" />
                <div className="container">
                    <div className="hero__content">
                        <div className="hero__badge">📢 KI Werbung kommt nach Deutschland – Jetzt vorbereiten</div>
                        <h1>
                            <span className="gradient-text">KI Werbung Berlin</span><br />
                            Ihre Beratung für AI Ads & KI-Kampagnen
                        </h1>
                        <p className="hero__subtitle">
                            Wir sind Ihre spezialisierte Beratung für <strong>KI Werbung</strong> und <strong>AI Ads</strong> in Berlin.
                            Wir unterstützen Sie bei der strategischen Planung, Umsetzung und Optimierung von Werbekampagnen
                            auf KI-Plattformen wie ChatGPT, Perplexity und Google AI – bevor Ihre Konkurrenz es tut.
                        </p>
                        <div className="hero__actions">
                            <a href="#kontakt" className="btn btn--primary">Kostenlose Erstberatung sichern →</a>
                            <a href="#was-ist-ki-werbung" className="btn btn--secondary">Was ist KI Werbung?</a>
                        </div>
                        <div className="hero__trust">
                            <span>Vertraut von:</span>
                            <div className="trust-badges">
                                <span className="trust-badge">famefact</span>
                                <span className="trust-badge">Berlin</span>
                                <span className="trust-badge">Seit 2010</span>
                                <span className="trust-badge">100+ Kunden</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          PROBLEM / PAIN SECTION
      ═══════════════════════════════════════ */}
            <section className="section section--alt" id="problem">
                <div className="container">
                    <FadeIn>
                        <div className="text-center">
                            <span className="section-label">Das Problem</span>
                            <h2 className="headline-lg">Die Werbelandschaft wird durch KI grundlegend neu definiert</h2>
                            <p className="body-lg" style={{ maxWidth: 700, margin: '0 auto' }}>
                                Klassische Online-Werbung verliert zunehmend an Wirkung. Nutzer verwenden Ad-Blocker, ignorieren
                                Banner und vertrauen stattdessen KI-gestützten Empfehlungen. Gleichzeitig eröffnen neue Werbeformate
                                in ChatGPT, Perplexity und Google AI völlig neue Möglichkeiten – doch die meisten Unternehmen wissen
                                nicht, wie sie diese Chance nutzen können. Wer jetzt nicht in KI Werbung investiert, wird den Anschluss
                                verlieren. Die Frage ist nicht ob, sondern wann KI Werbung zum Standard wird – und ob Sie dann bereit sind.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="pain__grid">
                        <FadeIn delay={100}>
                            <div className="glass-card pain-card">
                                <div className="pain-card__icon">📉</div>
                                <div className="pain-card__stat">42%</div>
                                <div className="pain-card__text">
                                    der Internetnutzer weltweit verwenden Ad-Blocker. Klassische Bannerwerbung erreicht immer weniger Menschen und verliert rapide an Effektivität.
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={200}>
                            <div className="glass-card pain-card">
                                <div className="pain-card__icon">🤖</div>
                                <div className="pain-card__stat">200 Mio.</div>
                                <div className="pain-card__text">
                                    wöchentlich aktive Nutzer hat ChatGPT weltweit. OpenAI hat bereits KI-Werbeanzeigen in den USA eingeführt – Europa folgt 2026.
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={300}>
                            <div className="glass-card pain-card">
                                <div className="pain-card__icon">⚠️</div>
                                <div className="pain-card__stat">95%</div>
                                <div className="pain-card__text">
                                    der deutschen Unternehmen haben noch keine KI-Werbestrategie. Wer jetzt handelt, sichert sich den entscheidenden First-Mover-Vorteil in einem neuen Werbemarkt.
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          WAS IST KI WERBUNG?
      ═══════════════════════════════════════ */}
            <section className="section" id="was-ist-ki-werbung">
                <div className="container">
                    <FadeIn>
                        <span className="section-label">Grundlagen</span>
                        <h2 className="headline-lg">Was ist KI Werbung und wie funktioniert AI Advertising?</h2>
                    </FadeIn>

                    <div className="explain__grid">
                        <FadeIn className="explain__content slide-in-left">
                            <p>
                                <strong>KI Werbung</strong> – auch bekannt als <strong>AI Advertising</strong> oder <strong>ChatGPT Ads</strong> – bezeichnet
                                eine völlig neue Generation von Werbeformaten, die innerhalb von KI-gestützten Plattformen und Suchsystemen
                                ausgespielt werden. Im Gegensatz zu klassischer Online-Werbung wie Google Ads oder Social Media Ads
                                werden KI-Werbeanzeigen kontextuell in die Konversation zwischen Nutzer und KI integriert.
                            </p>
                            <p>
                                Das bedeutet: Wenn ein Nutzer ChatGPT nach einem bestimmten Produkt, einer Dienstleistung oder einer
                                Lösung fragt, erscheint Ihre Werbebotschaft als natürlicher, relevanter Teil der KI-Antwort – nicht als
                                störendes Banner am Seitenrand. OpenAI hat dieses Format unter dem Namen „Sponsored Results" bereits
                                in den USA eingeführt und plant die schrittweise Expansion nach Europa und Deutschland. Experten rechnen
                                mit dem Start in Deutschland im Laufe von 2026, und die Werbeplätze werden anfangs begrenzt und
                                entsprechend begehrt sein.
                            </p>
                            <p>
                                Die Besonderheit von <strong>KI Werbung</strong> liegt in der Art des Targetings: Statt auf demografische Daten oder
                                Keywords zu setzen, basiert das Targeting auf dem tatsächlichen Konversationskontext. Die KI versteht,
                                welches Problem der Nutzer lösen möchte, welchen Informationsbedarf er hat und in welcher Phase seiner
                                Customer Journey er sich befindet. Daraus ergibt sich ein hochpräzises, Intent-basiertes Targeting,
                                das klassischen Werbeformaten in puncto Relevanz und Conversion Rate deutlich überlegen ist.
                            </p>

                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Kriterium</th>
                                        <th>Klassische Werbung</th>
                                        <th>KI Werbung</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Format</td>
                                        <td>Banner, Text-Ads, Display</td>
                                        <td>Kontextuelle Integration in KI-Antworten</td>
                                    </tr>
                                    <tr>
                                        <td>Targeting</td>
                                        <td>Keywords, Demografie</td>
                                        <td>Konversationskontext & Intent</td>
                                    </tr>
                                    <tr>
                                        <td>Nutzererlebnis</td>
                                        <td>Unterbrechende Werbung</td>
                                        <td>Natürliche, hilfreiche Empfehlung</td>
                                    </tr>
                                    <tr>
                                        <td>Plattformen</td>
                                        <td>Google, Meta, LinkedIn</td>
                                        <td>ChatGPT, Perplexity, Google AI</td>
                                    </tr>
                                    <tr>
                                        <td>Ad-Blocker</td>
                                        <td>Wird häufig blockiert</td>
                                        <td>Nicht blockierbar</td>
                                    </tr>
                                </tbody>
                            </table>
                        </FadeIn>

                        <FadeIn className="slide-in-right">
                            <h3 className="headline-md" style={{ marginBottom: 'var(--space-md)' }}>KI-Werbeplattformen im Überblick</h3>
                            <div className="ai-platforms">
                                <div className="ai-platform">
                                    <span className="ai-platform__icon">💬</span>
                                    <div>
                                        <div className="ai-platform__name">ChatGPT Ads</div>
                                        <small style={{ color: 'var(--color-white-40)' }}>OpenAI – Sponsored Results</small>
                                    </div>
                                </div>
                                <div className="ai-platform">
                                    <span className="ai-platform__icon">🔍</span>
                                    <div>
                                        <div className="ai-platform__name">Perplexity Ads</div>
                                        <small style={{ color: 'var(--color-white-40)' }}>AI Search Advertising</small>
                                    </div>
                                </div>
                                <div className="ai-platform">
                                    <span className="ai-platform__icon">✨</span>
                                    <div>
                                        <div className="ai-platform__name">Google AI Overviews</div>
                                        <small style={{ color: 'var(--color-white-40)' }}>SGE Sponsored</small>
                                    </div>
                                </div>
                                <div className="ai-platform">
                                    <span className="ai-platform__icon">🧠</span>
                                    <div>
                                        <div className="ai-platform__name">Bing Copilot Ads</div>
                                        <small style={{ color: 'var(--color-white-40)' }}>Microsoft AI Ads</small>
                                    </div>
                                </div>
                                <div className="ai-platform">
                                    <span className="ai-platform__icon">🎯</span>
                                    <div>
                                        <div className="ai-platform__name">Meta AI Ads</div>
                                        <small style={{ color: 'var(--color-white-40)' }}>Social AI Integration</small>
                                    </div>
                                </div>
                                <div className="ai-platform">
                                    <span className="ai-platform__icon">🌐</span>
                                    <div>
                                        <div className="ai-platform__name">You.com Ads</div>
                                        <small style={{ color: 'var(--color-white-40)' }}>Emerging AI Search</small>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card" style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)' }}>
                                <p style={{ color: 'var(--color-white-80)', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.7 }}>
                                    „<strong>KI Werbung</strong> ist nicht die Zukunft der Online-Werbung – sie ist die Gegenwart.
                                    Unternehmen, die sich jetzt positionieren, sichern sich die besten Werbeplätze zu den
                                    günstigsten Konditionen. Wer wartet, zahlt später deutlich mehr."
                                </p>
                                <p style={{ color: 'var(--color-positive-green)', fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: 0 }}>
                                    — Tobias Sander, Geschäftsführer famefact
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          LEISTUNGEN / SERVICES
      ═══════════════════════════════════════ */}
            <section className="section section--alt" id="leistungen">
                <div className="container">
                    <FadeIn>
                        <div className="text-center">
                            <span className="section-label">Unsere Leistungen</span>
                            <h2 className="headline-lg">Ganzheitliche KI Werbung Beratung für Ihr Unternehmen</h2>
                            <p className="body-lg" style={{ maxWidth: 700, margin: '0 auto' }}>
                                Von der strategischen Erstanalyse bis zur laufenden Kampagnenoptimierung – wir begleiten Sie
                                auf dem gesamten Weg in die Welt der KI-gestützten Werbung. Unsere Leistungen sind modular
                                aufgebaut und werden individuell auf Ihre Branche und Ihre Ziele zugeschnitten.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="services__grid">
                        <FadeIn delay={100}>
                            <article className="glass-card service-card">
                                <span className="service-card__number">01</span>
                                <div className="service-card__icon">🔬</div>
                                <h3>KI-Werbe-Readiness Audit</h3>
                                <p>
                                    Wir analysieren systematisch, wie gut Ihr Unternehmen auf KI Werbung vorbereitet ist. Dabei prüfen wir
                                    Ihre aktuelle digitale Präsenz, die Qualität Ihrer Inhalte aus KI-Perspektive, Ihre Entity Authority
                                    in Knowledge Graphs und identifizieren konkrete Handlungsfelder. Sie erhalten einen detaillierten
                                    Report mit priorisierten Maßnahmen und einer realistischen Einschätzung Ihres KI-Werbepotenzials.
                                </p>
                            </article>
                        </FadeIn>

                        <FadeIn delay={200}>
                            <article className="glass-card service-card">
                                <span className="service-card__number">02</span>
                                <div className="service-card__icon">📋</div>
                                <h3>KI Ads Strategie & Konzeption</h3>
                                <p>
                                    Basierend auf dem Readiness Audit entwickeln wir eine maßgeschneiderte KI-Werbestrategie für
                                    Ihr Unternehmen. Diese umfasst die Auswahl der richtigen KI-Werbeplattformen, die Definition
                                    Ihrer Zielgruppen im Konversationskontext, die Entwicklung von KI-optimierten Werbebotschaften
                                    und einen konkreten Rollout-Plan für den Deutschland-Launch von ChatGPT Ads und weiteren Plattformen.
                                </p>
                            </article>
                        </FadeIn>

                        <FadeIn delay={300}>
                            <article className="glass-card service-card">
                                <span className="service-card__number">03</span>
                                <div className="service-card__icon">✍️</div>
                                <h3>KI-optimierte Werbetexte & Kreation</h3>
                                <p>
                                    KI-Werbeanzeigen erfordern eine völlig andere Herangehensweise als klassische Ad Copy. Die Texte
                                    müssen sich nahtlos in den Konversationsfluss der KI integrieren und gleichzeitig Ihre Werbebotschaft
                                    überzeugend transportieren. Wir erstellen Werbetexte, die von KI-Systemen als relevant und hilfreich
                                    eingestuft werden – und die gleichzeitig konvertieren.
                                </p>
                            </article>
                        </FadeIn>

                        <FadeIn delay={400}>
                            <article className="glass-card service-card">
                                <span className="service-card__number">04</span>
                                <div className="service-card__icon">🏗️</div>
                                <h3>GEO-Grundlagenoptimierung</h3>
                                <p>
                                    Bezahlte KI Werbung funktioniert am besten in Kombination mit einer starken organischen KI-Präsenz.
                                    Wir optimieren Ihre Website, Ihre strukturierten Daten und Ihre digitale Entity so, dass KI-Systeme
                                    Ihr Unternehmen als vertrauenswürdige Autorität erkennen. Diese Generative Engine Optimization (GEO)
                                    bildet das Fundament für erfolgreiche KI-Werbekampagnen und steigert deren Effektivität signifikant.
                                </p>
                            </article>
                        </FadeIn>

                        <FadeIn delay={500}>
                            <article className="glass-card service-card">
                                <span className="service-card__number">05</span>
                                <div className="service-card__icon">📊</div>
                                <h3>Kampagnenmanagement & Optimierung</h3>
                                <p>
                                    Sobald KI Ads in Deutschland verfügbar sind, übernehmen wir das komplette Kampagnenmanagement
                                    für Sie. Von der Einrichtung Ihrer Werbekonten über die laufende Budget-Optimierung bis zum
                                    A/B-Testing verschiedener Werbebotschaften und Targeting-Strategien. Wir maximieren Ihren ROAS
                                    (Return on Ad Spend) und stellen sicher, dass jeder Euro optimal eingesetzt wird.
                                </p>
                            </article>
                        </FadeIn>

                        <FadeIn delay={600}>
                            <article className="glass-card service-card">
                                <span className="service-card__number">06</span>
                                <div className="service-card__icon">📡</div>
                                <h3>KI-Werbe-Monitoring & Reporting</h3>
                                <p>
                                    Transparenz ist uns wichtig. Sie erhalten monatliche Reports mit allen relevanten KPIs: Impressionen
                                    in KI-Konversationen, Click-Through-Rates, Conversion-Daten, Cost per Acquisition und Vergleiche
                                    mit klassischen Werbeformaten. Unser Monitoring umfasst auch die Wettbewerbsbeobachtung –
                                    damit Sie immer wissen, was Ihre Konkurrenz im Bereich KI Werbung unternimmt.
                                </p>
                            </article>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          WARUM FAMEFACT
      ═══════════════════════════════════════ */}
            <section className="section" id="warum-famefact">
                <div className="container">
                    <FadeIn>
                        <span className="section-label">Ihre Vorteile</span>
                        <h2 className="headline-lg">Warum famefact als KI Werbung Berater in Berlin?</h2>
                    </FadeIn>

                    <div className="why__grid">
                        <FadeIn className="why__content slide-in-left">
                            <p>
                                Als eine der ersten spezialisierten Agenturen für KI Werbung in Deutschland vereinen wir tiefes
                                technisches Verständnis von KI-Systemen mit jahrelanger Erfahrung in Performance Marketing und
                                Social Media. Seit unserer Gründung 2010 in Berlin haben wir über 100 Unternehmen bei ihrer
                                digitalen Transformation begleitet – und verstehen genau, wie sich neue Werbeformate erfolgreich
                                einsetzen lassen.
                            </p>
                            <p>
                                Der entscheidende Vorteil: Wir beschäftigen uns bereits seit der Einführung von ChatGPT intensiv
                                mit dem Thema KI-Marketing. Mit einem Netzwerk von <strong>über 20 spezialisierten Domains</strong> im
                                Bereich KI, GEO und LLMO haben wir uns einzigartige Expertise aufgebaut, die kein anderer Berater
                                in Berlin bieten kann. Wir wissen nicht nur theoretisch, wie KI Werbung funktioniert – wir
                                praktizieren KI-Marketing täglich.
                            </p>

                            <div className="usp-list">
                                <div className="usp-item">
                                    <div className="usp-item__icon">🏢</div>
                                    <div className="usp-item__content">
                                        <h4>Berliner Agentur mit 15+ Jahren Erfahrung</h4>
                                        <p>Seit 2010 im digitalen Marketing – von Social Media über SEO bis KI Werbung.</p>
                                    </div>
                                </div>
                                <div className="usp-item">
                                    <div className="usp-item__icon">🚀</div>
                                    <div className="usp-item__content">
                                        <h4>First Mover in KI-Marketing</h4>
                                        <p>20+ spezialisierte Domains im KI-Bereich – unser Wissen ist praxis­erprobt.</p>
                                    </div>
                                </div>
                                <div className="usp-item">
                                    <div className="usp-item__icon">📈</div>
                                    <div className="usp-item__content">
                                        <h4>Datengetriebene Optimierung</h4>
                                        <p>Transparente KPIs, messbare Ergebnisse und kontinuierliche Performance-Steigerung.</p>
                                    </div>
                                </div>
                                <div className="usp-item">
                                    <div className="usp-item__icon">🤝</div>
                                    <div className="usp-item__content">
                                        <h4>Ganzheitlicher Ansatz</h4>
                                        <p>KI Werbung + GEO + Content = maximale Sichtbarkeit in der KI-Welt.</p>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn className="slide-in-right">
                            <div className="why__stats">
                                <div className="glass-card stat-card">
                                    <div className="stat-card__number">15+</div>
                                    <div className="stat-card__label">Jahre Erfahrung</div>
                                </div>
                                <div className="glass-card stat-card">
                                    <div className="stat-card__number">100+</div>
                                    <div className="stat-card__label">Zufriedene Kunden</div>
                                </div>
                                <div className="glass-card stat-card">
                                    <div className="stat-card__number">20+</div>
                                    <div className="stat-card__label">KI-Domains aktiv</div>
                                </div>
                                <div className="glass-card stat-card">
                                    <div className="stat-card__number">Berlin</div>
                                    <div className="stat-card__label">Standort & ♥</div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          PROZESS
      ═══════════════════════════════════════ */}
            <section className="section section--alt" id="prozess">
                <div className="container">
                    <FadeIn>
                        <div className="text-center">
                            <span className="section-label">So arbeiten wir</span>
                            <h2 className="headline-lg">Ihr Weg zur erfolgreichen KI Werbung</h2>
                            <p className="body-lg" style={{ maxWidth: 700, margin: '0 auto' }}>
                                In vier klar definierten Phasen bereiten wir Ihr Unternehmen auf die Zukunft der
                                KI-gestützten Werbung vor – von der Analyse bis zur laufenden Kampagnenoptimierung.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="process__steps">
                        {[
                            { num: 1, title: 'Analyse', desc: 'Umfassender KI-Werbe-Readiness Audit: Wie gut ist Ihr Unternehmen auf KI Werbung vorbereitet? Wettbewerbsanalyse und Potenzialidentifikation.' },
                            { num: 2, title: 'Strategie', desc: 'Maßgeschneiderte KI-Werbestrategie mit Plattformauswahl, Zielgruppen-Definition, Budget-Empfehlung und konkretem Rollout-Plan.' },
                            { num: 3, title: 'Vorbereitung', desc: 'GEO-Grundlagenoptimierung, KI-optimierte Inhalte, Entity Building und technische Infrastruktur für den sofortigen Start beim Launch.' },
                            { num: 4, title: 'Kampagne', desc: 'Aktives Kampagnenmanagement, laufende Optimierung, A/B-Testing und transparentes Reporting mit klaren KPIs und ROAS-Fokus.' },
                        ].map((step, i) => (
                            <FadeIn key={step.num} delay={i * 150}>
                                <div className="step-card">
                                    <div className="step-card__number">{step.num}</div>
                                    <h3>{step.title}</h3>
                                    <p>{step.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          FAQ
      ═══════════════════════════════════════ */}
            <section className="section" id="faq">
                <div className="container">
                    <FadeIn>
                        <div className="text-center">
                            <span className="section-label">Häufige Fragen</span>
                            <h2 className="headline-lg">Alles über KI Werbung & AI Ads</h2>
                            <p className="body-lg" style={{ maxWidth: 700, margin: '0 auto' }}>
                                Die wichtigsten Fragen und Antworten rund um KI Werbung, ChatGPT Ads und
                                AI Advertising – verständlich erklärt für Entscheider und Marketing-Verantwortliche.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn>
                        <div className="faq__list" itemScope itemType="https://schema.org/FAQPage">
                            <FaqItem
                                question="Was genau ist KI Werbung?"
                                answer="KI Werbung (auch AI Advertising oder AI Ads) bezeichnet Werbeformate, die innerhalb von KI-gestützten Plattformen wie ChatGPT, Perplexity oder Google AI ausgespielt werden. Statt klassischer Banner oder Textanzeigen in Suchergebnislisten erscheinen die Werbebotschaften kontextuell integriert in KI-generierte Antworten – genau dann, wenn der Nutzer ein für Ihr Unternehmen relevantes Thema bespricht. Dies ist fundamental anders als jede bisherige Form der Online-Werbung."
                            />
                            <FaqItem
                                question="Wann kommt KI Werbung nach Deutschland und Berlin?"
                                answer="OpenAI hat ChatGPT Ads (Sponsored Results) zunächst in den USA gestartet und plant eine schrittweise Expansion nach Europa. Branchenexperten rechnen mit einem Launch in Deutschland und der EU im Laufe von 2026. Auch Perplexity und Google AI experimentieren bereits mit Werbeformaten. Unternehmen, die sich jetzt vorbereiten, sichern sich einen entscheidenden Wettbewerbsvorteil – sowohl durch günstigere Einstiegspreise als auch durch die Early-Adopter-Positionierung."
                            />
                            <FaqItem
                                question="Warum brauche ich eine Beratung für KI Werbung?"
                                answer="KI Werbung funktioniert grundlegend anders als Google Ads oder Social Media Ads. Die Anzeigen werden in einen Konversationskontext eingebettet und erfordern ein tiefes Verständnis von KI-Plattformen, natürlicher Sprache und Prompt-Kontexten. Klassische Performance-Marketing-Agenturen haben dieses Wissen nicht. Eine spezialisierte KI-Werbe-Beratung hilft Ihnen, von Anfang an die richtigen Strategien zu entwickeln, Budgetverschwendung zu vermeiden und als First Mover zu profitieren."
                            />
                            <FaqItem
                                question="Was kostet KI Werbung Beratung?"
                                answer="Die Kosten für KI Werbung Beratung variieren je nach Umfang. Strategische Erstberatungen und Readiness-Audits beginnen bei 2.000€. Laufende Kampagnenbetreuung und Optimierung liegt typischerweise bei 1.500–5.000€ pro Monat, abhängig von Budget und Komplexität. Die eigentlichen Werbekosten (Media Budget) kommen hinzu und werden von den jeweiligen Plattformen festgelegt. Wir erstellen Ihnen ein individuelles Angebot nach einer kostenlosen Erstanalyse."
                            />
                            <FaqItem
                                question="Wie unterscheidet sich KI Werbung von Google Ads?"
                                answer="Google Ads basieren auf Keyword-Matching und erscheinen in Suchergebnislisten als klar gekennzeichnete Anzeigen. KI Werbung wird hingegen kontextuell in eine laufende Konversation mit KI-Systemen integriert. Der Nutzer erlebt die Werbung als natürlichen, hilfreichen Teil der KI-Antwort. Dies führt zu höherer Akzeptanz, besserer Relevanz und potenziell deutlich höheren Conversion Rates. Zudem sind KI Ads nicht durch Ad-Blocker blockierbar."
                            />
                            <FaqItem
                                question="Für welche Branchen eignet sich KI Werbung besonders?"
                                answer="KI Werbung eignet sich besonders für Branchen mit erklärungsbedürftigen Produkten und hohem Beratungsbedarf: Finanzdienstleister, Versicherungen, SaaS-Unternehmen, B2B-Dienstleister, E-Commerce, Rechtsanwälte, Gesundheitswesen, Immobilien und Bildungsanbieter. Je komplexer Ihr Angebot, desto besser können KI Ads ihre Stärke ausspielen – kontextuelle, erklärende Werbung direkt in der Konversation, wenn der Nutzer aktiv nach Lösungen sucht."
                            />
                            <FaqItem
                                question="Kann ich mich jetzt schon auf KI Werbung vorbereiten?"
                                answer="Ja, und das empfehlen wir ausdrücklich. Die Vorbereitung auf KI Werbung umfasst mehrere Dimensionen: die Optimierung Ihrer digitalen Präsenz für KI-Systeme (GEO – Generative Engine Optimization), den Aufbau von Entity Authority in Knowledge Graphs, die Erstellung KI-optimierter Inhalte und die Entwicklung einer KI-Ads-Strategie. Wer jetzt die Grundlagen legt, kann beim Europa-Launch sofort durchstarten und profitiert von niedrigeren Kosten bei geringerem Wettbewerb."
                            />
                            <FaqItem
                                question="Was ist der Zusammenhang zwischen KI Werbung und GEO?"
                                answer="GEO (Generative Engine Optimization) optimiert Ihre organische Sichtbarkeit in KI-Antworten – Sie werden als Quelle zitiert, ohne dafür zu bezahlen. KI Werbung sind bezahlte Werbeplätze innerhalb von KI-Konversationen. Beide Strategien ergänzen sich perfekt: GEO baut langfristige Autorität und Vertrauen auf, KI Werbung liefert sofortige Sichtbarkeit und direkte Lead-Generierung. Unsere Beratung deckt beides ab – für maximale KI-Sichtbarkeit."
                            />
                            <FaqItem
                                question="Wie funktioniert das Targeting bei KI Werbung?"
                                answer="Das Targeting bei KI Werbung basiert nicht auf demografischen Daten oder Keywords, sondern auf dem realen Konversationskontext. Die KI erkennt, worüber der Nutzer spricht, welche Fragen er stellt und in welcher Phase seiner Kaufentscheidung er sich befindet. Darauf basierend werden kontextuell passende Anzeigen ausgespielt. Dies ermöglicht ein hochpräzises Intent-basiertes Targeting, das klassischen Werbeformaten in Relevanz und Conversion Rate überlegen ist."
                            />
                            <FaqItem
                                question="Warum famefact als KI Werbung Berater in Berlin wählen?"
                                answer="famefact ist seit 2010 in Berlin im digitalen Marketing aktiv und war eine der ersten Agenturen in Deutschland, die sich auf KI-Marketing spezialisiert hat. Mit über 100 betreuten Kunden, einem Netzwerk von 20+ spezialisierten Domains im KI-Bereich und tiefem technischem Verständnis von OpenAI, ChatGPT und LLM-Systemen sind wir der ideale Partner für Ihre KI-Werbestrategie. Wir warten nicht auf die Zukunft – wir gestalten sie mit Ihnen."
                            />
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          KONTAKT / CTA
      ═══════════════════════════════════════ */}
            <section className="section contact" id="kontakt">
                <div className="container">
                    <FadeIn>
                        <div className="text-center">
                            <span className="section-label">Jetzt starten</span>
                            <h2 className="headline-lg">Bereit für KI Werbung in Berlin?</h2>
                            <p className="body-lg" style={{ maxWidth: 700, margin: '0 auto' }}>
                                Lassen Sie uns in einem kostenlosen Erstgespräch analysieren, wie gut Ihr Unternehmen
                                auf KI Werbung vorbereitet ist – und wie Sie als einer der Ersten in Deutschland
                                von ChatGPT Ads und AI Advertising profitieren können.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="contact__grid">
                        <FadeIn className="slide-in-left">
                            <ContactForm />
                        </FadeIn>

                        <FadeIn className="slide-in-right">
                            <div className="contact-info">
                                <h3>Direkt Kontakt aufnehmen</h3>
                                <p>
                                    Sie möchten lieber direkt mit uns sprechen? Kein Problem – schreiben Sie uns eine E-Mail
                                    und wir melden uns innerhalb von 24 Stunden bei Ihnen zurück.
                                </p>

                                <div className="contact-detail">
                                    <div className="contact-detail__icon">📧</div>
                                    <div className="contact-detail__text">
                                        <a href="mailto:info@famefact.com">info@famefact.com</a>
                                    </div>
                                </div>

                                <div className="contact-detail">
                                    <div className="contact-detail__icon">📍</div>
                                    <div className="contact-detail__text">
                                        Schliemannstr. 23, 10437 Berlin
                                    </div>
                                </div>

                                <div className="contact-detail">
                                    <div className="contact-detail__icon">🌐</div>
                                    <div className="contact-detail__text">
                                        <a href="https://famefact.com" target="_blank" rel="noopener noreferrer">famefact.com</a>
                                    </div>
                                </div>

                                <div className="glass-card" style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)' }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>✓ Kostenlose Erstberatung</h4>
                                    <p style={{ color: 'var(--color-white-60)', fontSize: '0.9rem', marginBottom: 0, lineHeight: 1.7 }}>
                                        Wir prüfen Ihre KI-Werbe-Readiness kostenlos und unverbindlich.
                                        Sie erhalten eine erste Einschätzung Ihres Potenzials und
                                        konkrete Handlungsempfehlungen für den Einstieg in KI Werbung.
                                    </p>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>
        </>
    )
}
