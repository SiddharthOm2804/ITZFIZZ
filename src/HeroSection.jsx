import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import carImage from './assets/mclaren-top-view.png'

gsap.registerPlugin(ScrollTrigger)

const metrics = [
  {
    value: '58',
    label: 'Increase in pick up point use',
    tone: 'lime',
    className: 'metric-card--one',
  },
  {
    value: '23',
    label: 'Decreased in customer phone calls',
    tone: 'blue',
    className: 'metric-card--two',
  },
  {
    value: '27',
    label: 'Increase in pick up point use',
    tone: 'ink',
    className: 'metric-card--three',
  },
  {
    value: '40',
    label: 'Decreased in customer phone calls',
    tone: 'orange',
    className: 'metric-card--four',
  },
]

function CarImage() {
  return (
    <img
      className="car-art"
      src={carImage}
      alt="Teal McLaren sports car viewed from above"
      draggable="false"
    />
  )
}

function MetricCard({ metric }) {
  return (
    <article
      className={`metric-card ${metric.className} metric-card--${metric.tone}`}
    >
      <p className="metric-card__value">
        {metric.value}<span>%</span>
      </p>
      <p className="metric-card__label">{metric.label}</p>
    </article>
  )
}

export default function HeroSection() {
  const sceneRef = useRef(null)
  const carRef = useRef(null)
  const titleRef = useRef(null)
  const revealRef = useRef(null)

  useLayoutEffect(() => {
    const scope = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } }).fromTo(
        '.metric-card',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.68, stagger: 0.1 },
      )

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const carWidth = () => carRef.current?.getBoundingClientRect().width ?? 0

      const drive = gsap.timeline({
        scrollTrigger: {
          trigger: sceneRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: reducedMotion ? 0.18 : 1.15,
          invalidateOnRefresh: true,
        },
      })

      drive
        .fromTo(
          titleRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, ease: 'none', duration: 0.16 },
          0,
        )
        .fromTo(
          carRef.current,
          { x: 0 },
          { x: () => window.innerWidth + carWidth() * 0.12, ease: 'none', duration: 1 },
          0,
        )
        .fromTo(revealRef.current, { scaleX: 0.06 }, { scaleX: 1, ease: 'none', duration: 1 }, 0)
        .to('.metric-card--one', { x: -30, ease: 'none', duration: 1 }, 0)
        .to('.metric-card--two', { x: 24, ease: 'none', duration: 1 }, 0)
        .to('.metric-card--three', { x: -20, ease: 'none', duration: 1 }, 0)
        .to('.metric-card--four', { x: 18, ease: 'none', duration: 1 }, 0)
    }, sceneRef)

    return () => scope.revert()
  }, [])

  return (
    <main className="experience min-h-screen w-full">
      <section className="scroll-scene" ref={sceneRef} aria-label="Welcome to ITZFIZZ">
        <div className="hero-stage">
          <div className="track">
            <div className="track__reveal" ref={revealRef} aria-hidden="true" />
            <div className="hero__headline-frame">
              <h1 className="hero__headline" ref={titleRef}>
                W E L C O M E I T Z F I Z Z
              </h1>
            </div>
            <div className="hero__car-frame">
              <div className="hero__car" ref={carRef}>
                <CarImage />
              </div>
            </div>
          </div>

          <div className="hero__metrics" role="group" aria-label="Customer impact statistics">
            {metrics.map((metric) => <MetricCard key={metric.value} metric={metric} />)}
          </div>
        </div>
      </section>
    </main>
  )
}
