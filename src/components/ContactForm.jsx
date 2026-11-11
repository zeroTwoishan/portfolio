import { useState } from 'react'
import { contact } from '../data/projects.js'

// "Send a message". With contact.formEndpoint set (a Formspree form URL), the form posts there: natively
// without JS, via fetch with JS so the visitor stays on the page. Without an endpoint it opens the visitor's
// email app with the message filled in, so it works before any service is set up.
const field = 'glass w-full rounded-xl px-4 py-3 text-silver placeholder:text-ash/80 focus-visible:outline-2 focus-visible:outline-silver'

export default function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const endpoint = contact.formEndpoint

  const submit = async (e) => {
    const form = e.currentTarget
    const data = new FormData(form)
    if (data.get('_gotcha')) return e.preventDefault() // honeypot: bots fill hidden fields
    e.preventDefault()
    if (!endpoint) {
      const subject = encodeURIComponent(`Portfolio message from ${data.get('name')}`)
      const body = encodeURIComponent(`${data.get('message')}\n\n— ${data.get('name')} <${data.get('email')}>`)
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error') // keep what they typed so nothing is lost
    }
  }

  return (
    <form
      action={endpoint || undefined}
      method="POST"
      onSubmit={submit}
      aria-labelledby="message-title"
      className="glass mt-12 max-w-3xl rounded-3xl p-6 md:p-10"
    >
      <h3 id="message-title" className="flex items-center gap-3 font-display text-3xl">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 text-safelight-bright" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M3 6h18v12H3zM3 6l9 7 9-7" /></svg>
        Send a message
      </h3>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="label text-ash">Name</span>
          <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" className={`${field} mt-2`} />
        </label>
        <label className="block">
          <span className="label text-ash">Email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@mail.com" className={`${field} mt-2`} />
        </label>
        <label className="block md:col-span-2">
          <span className="label text-ash">Message</span>
          <textarea name="message" required minLength={10} maxLength={5000} rows={5} placeholder="What's on your mind?" className={`${field} mt-2 resize-y`} />
        </label>
        {/* Honeypot for spam bots; hidden from people and screen readers. */}
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group glass inline-flex items-center gap-2 rounded-full px-7 py-3 text-silver transition-colors hover:border-safelight-bright/60 disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 text-safelight-bright transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" /></svg>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p role="status" className="text-sm text-ash">
          {status === 'sent' && 'Thanks — your message is on its way.'}
          {status === 'error' && `Couldn't send it. Please try again, or email ${contact.email}.`}
          {status === 'idle' && !endpoint && 'Opens your email app with the message ready to send.'}
        </p>
      </div>
    </form>
  )
}
