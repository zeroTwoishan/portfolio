import { MagneticA } from './Magnetic.jsx'

// One project as a large glass card: the story and links on one side, a big framed screenshot on the other.
// Cards alternate sides on desktop (`flip`). Everything a recruiter needs is visible without hovering.
const srcset = ({ base, widths }, ext) => widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ')
const sizes = '(min-width: 1384px) 700px, (min-width: 1024px) 52vw, 90vw'

function Shot({ project, frame }) {
  return (
    <figure>
      <div className="print-img relative aspect-[16/10] overflow-hidden rounded-2xl border border-silver/10 bg-obsidian" data-preview={project.preview}>
        {project.img ? (
          <picture>
            <source type="image/avif" srcSet={srcset(project.img, 'avif')} sizes={sizes} />
            <img
              src={`${project.img.base}-${project.img.widths[0]}.webp`}
              srcSet={srcset(project.img, 'webp')}
              sizes={sizes}
              width={project.img.w}
              height={project.img.h}
              loading="lazy"
              alt={project.alt}
              className="size-full object-cover object-top"
            />
          </picture>
        ) : (
          // Undeveloped frame: shown until the project's screenshot exists.
          <div role="img" aria-label={`${project.title} screenshot coming soon`} className="grid size-full place-items-center bg-[repeating-linear-gradient(135deg,transparent_0_12px,rgb(234_229_220/0.05)_12px_13px)]">
            <p className="label text-ash">Frame {frame} · Developing…</p>
          </div>
        )}
        {/* W3: an underexposed layer that clears as the print develops (fully clear without JS). */}
        <div aria-hidden="true" className="develop absolute inset-0 bg-obsidian opacity-0" />
      </div>
      <figcaption className="label mt-3 flex justify-between text-ash">
        <span>Frame {frame}</span>
        <span>{project.title} · {project.year}</span>
      </figcaption>
    </figure>
  )
}

const Arrow = () => (
  <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none">→</span>
)
const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>

export default function Print({ project, frame, flip = false }) {
  return (
    <article id={project.slug} aria-labelledby={`${project.slug}-title`} className="print glass grid gap-8 rounded-[2rem] p-5 md:p-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-10">
      <div className={`lg:col-span-7 ${flip ? 'lg:order-last' : ''}`}>
        <Shot project={project} frame={frame} />
      </div>

      <div className="lg:col-span-5">
        <p className="label flex items-center gap-3 text-ash">
          <span>{frame}</span>
          <span aria-hidden="true" className="h-px w-8 bg-silver/20" />
          <span><span aria-hidden="true" className="mr-2 inline-block size-1.5 rounded-full bg-safelight-bright align-middle" />{project.status}</span>
        </p>
        <h3 id={`${project.slug}-title`} className="mt-4 poster text-5xl leading-none md:text-6xl">{project.title}</h3>
        <p className="mt-5 text-silver/90">{project.summary}</p>

        <ul aria-label="Built with" className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li key={s} className="rounded-full border border-silver/15 bg-silver/5 px-3 py-1 text-xs text-silver/85">{s}</li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.live && (
            <MagneticA href={project.live} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-silver px-5 py-2.5 text-sm font-medium text-obsidian">
              Live demo <Arrow /><NewTab />
            </MagneticA>
          )}
          <MagneticA href={project.repo} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full border border-silver/25 px-5 py-2.5 text-sm transition-colors hover:bg-silver/10">
            Code <Arrow /><NewTab />
          </MagneticA>
        </div>

        <div className="relative mt-8 pt-5">
          <span aria-hidden="true" className="rule absolute inset-x-0 top-0 h-px origin-left bg-silver/15" />
          <p className="text-sm text-ash">{project.role}</p>
          <details className="mt-4">
            <summary className="label cursor-pointer text-ash hover:text-silver">Read the case study</summary>
            <div className="mt-4 space-y-4 text-sm">
              <div><h4 className="label text-ash">Problem</h4><p className="mt-1">{project.problem}</p></div>
              <div><h4 className="label text-ash">Challenge</h4><p className="mt-1">{project.challenge}</p></div>
              <div><h4 className="label text-ash">Result</h4><p className="mt-1">{project.result}</p></div>
            </div>
          </details>
        </div>
      </div>
    </article>
  )
}
