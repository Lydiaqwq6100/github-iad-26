(function () {
  const QUERIES = {
    siteSettings: `*[_type == "siteSettings"][0]{
      siteName,
      heroTagline,
      email,
      instagramHandle,
      instagramUrl,
      aboutBio,
      education,
      "heroImageUrl": heroImage.asset->url,
      "aboutPhotoUrl": aboutPhoto.asset->url,
      "navIconUrl": navIcon.asset->url,
      "backgroundImageUrl": backgroundImage.asset->url
    }`,
    categories: `*[_type == "workCategory"] | order(order asc) {
      title,
      "slug": slug.current,
      "thumbnailUrl": thumbnail.asset->url
    }`,
  }

  function setText(selector, value) {
    const el = document.querySelector(selector)
    if (el && value) el.textContent = value
  }

  function setHtml(selector, value) {
    const el = document.querySelector(selector)
    if (el && value) el.innerHTML = value
  }

  function setImage(selector, url, alt) {
    const el = document.querySelector(selector)
    if (el && url) {
      el.src = url
      if (alt) el.alt = alt
    }
  }

  function setBackground(url) {
    if (!url) return
    document.body.style.backgroundImage = `url('${url}')`
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.style.backgroundPosition = 'center center'
    document.body.style.backgroundAttachment = 'fixed'
    document.body.style.backgroundSize = 'cover'
  }

  function renderEducation(items) {
    const container = document.getElementById('education-list')
    if (!container || !items?.length) return

    container.innerHTML = items
      .map(
        (item) => `
        <div class="relative pl-10">
          <span class="absolute -left-[9px] -top-1 text-xl select-none bg-transparent">★</span>
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <span class="text-sm font-bold">${SanityCMS.escapeHtml(item.period)}</span>
            <div class="sm:col-span-3">
              <h4 class="font-bold text-base">${SanityCMS.escapeHtml(item.title)}</h4>
              <p class="text-xs text-gray-600 mt-1">${SanityCMS.escapeHtml(item.institution)}</p>
            </div>
          </div>
        </div>`
      )
      .join('')
  }

  function renderWorks(categories) {
    const container = document.getElementById('works-grid')
    if (!container || !categories?.length) return

    container.innerHTML = categories
      .map(
        (cat) => `
        <a href="category.html?slug=${encodeURIComponent(cat.slug)}" class="group flex flex-col items-center text-center space-y-6">
          <div class="w-full aspect-[4/3] flex items-center justify-center transition group-hover:scale-[1.03] duration-300 ease-out">
            <img src="${cat.thumbnailUrl}" alt="${SanityCMS.escapeHtml(cat.title)}" class="w-full h-full object-cover rounded-sm shadow-xs">
          </div>
          <span class="text-2xl font-gothic group-hover:opacity-70 transition">${SanityCMS.escapeHtml(cat.title)}</span>
        </a>`
      )
      .join('')
  }

  function renderContacts(settings) {
    const emailLinks = document.querySelectorAll('[data-cms="email-link"]')
    const instagramLinks = document.querySelectorAll('[data-cms="instagram-link"]')

    emailLinks.forEach((link) => {
      if (settings.email) {
        link.href = `mailto:${settings.email}`
        link.textContent = settings.email
      }
    })

    instagramLinks.forEach((link) => {
      if (settings.instagramHandle) {
        link.textContent = settings.instagramHandle
      }
      if (settings.instagramUrl) {
        link.href = settings.instagramUrl
      }
    })
  }

  async function initHomepage() {
    if (!window.SanityCMS?.isConfigured()) return

    try {
      const [settings, categories] = await Promise.all([
        SanityCMS.fetchSanity(QUERIES.siteSettings),
        SanityCMS.fetchSanity(QUERIES.categories),
      ])

      if (!settings) return

      document.title = `${settings.siteName} | Portfolio`
      setText('[data-cms="site-name"]', settings.siteName)
      setText('[data-cms="hero-tagline"]', settings.heroTagline)
      setText('[data-cms="about-bio"]', settings.aboutBio)
      setImage('[data-cms="hero-image"]', settings.heroImageUrl, 'Portfolio')
      setImage('[data-cms="about-photo"]', settings.aboutPhotoUrl, settings.siteName)
      setBackground(settings.backgroundImageUrl)

      if (settings.navIconUrl) {
        document.querySelectorAll('[data-cms="nav-icon"]').forEach((img) => {
          img.src = settings.navIconUrl
        })
      }

      renderEducation(settings.education)
      renderWorks(categories)
      renderContacts(settings)
    } catch (error) {
      console.error('[CMS] Failed to load homepage content:', error)
    }
  }

  document.addEventListener('DOMContentLoaded', initHomepage)
})()
