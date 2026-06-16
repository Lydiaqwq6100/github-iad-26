(function () {
  const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug && published == true][0]{
    title,
    "slug": slug.current,
    "categoryTitle": category->title,
    "categorySlug": category->slug.current,
    description,
    awardNote,
    gallery[]{
      title,
      linkLabel,
      linkUrl,
      "imageUrl": image.asset->url,
      "fileUrl": file.asset->url
    }
  }`

  const CATEGORY_QUERY = `*[_type == "workCategory" && slug.current == $slug][0]{
    title,
    "slug": slug.current
  }`

  const CATEGORY_PROJECTS_QUERY = `*[_type == "project" && category->slug.current == $slug && published == true] | order(order asc) {
    title,
    "slug": slug.current,
    awardNote,
    "excerpt": description[0].children[0].text,
    "thumbnailUrl": gallery[0].image.asset->url
  }`

  function getSlugFromUrl() {
    return new URLSearchParams(window.location.search).get('slug')
  }

  function renderGallery(gallery) {
    const container = document.getElementById('project-gallery')
    if (!container || !gallery?.length) return

    container.innerHTML = gallery
      .map((item) => {
        const link = SanityCMS.getGalleryLink(item)
        const titleHtml = item.title
          ? `<h2 class="text-2xl font-gothic mb-4">${SanityCMS.escapeHtml(item.title)}</h2>`
          : ''

        const imageHtml = item.imageUrl
          ? `<img src="${item.imageUrl}" alt="${SanityCMS.escapeHtml(item.title || 'Project preview')}" class="preview-img">`
          : ''

        const linkHtml =
          item.linkLabel && link
            ? `<p class="mt-4 text-sm">
                <a href="${link}" target="_blank" rel="noopener noreferrer" class="underline hover:text-pink-600 transition">${SanityCMS.escapeHtml(item.linkLabel)}</a>
              </p>`
            : ''

        return `<section>${titleHtml}${imageHtml}${linkHtml}</section>`
      })
      .join('')
  }

  async function initProjectPage() {
    const slug = getSlugFromUrl()
    if (!slug) return

    if (!window.SanityCMS?.isConfigured()) {
      if (window.ProjectFallback?.renderProject(slug)) return
      document.getElementById('project-content')?.classList.add('hidden')
      document.getElementById('project-not-found')?.classList.remove('hidden')
      return
    }

    try {
      const project = await SanityCMS.fetchSanity(PROJECT_QUERY, {slug})
      if (!project) {
        document.getElementById('project-content')?.classList.add('hidden')
        document.getElementById('project-not-found')?.classList.remove('hidden')
        return
      }

      document.title = `${project.title} · Lydia Liu`
      document.getElementById('project-category').textContent = project.categoryTitle
      document.getElementById('project-title').textContent = project.title

      const descriptionEl = document.getElementById('project-description')
      if (descriptionEl) {
        descriptionEl.innerHTML = SanityCMS.renderPortableText(project.description)
      }

      const awardEl = document.getElementById('project-award')
      if (awardEl) {
        if (project.awardNote) {
          awardEl.textContent = project.awardNote
          awardEl.classList.remove('hidden')
        } else {
          awardEl.classList.add('hidden')
        }
      }

      renderGallery(project.gallery)
    } catch (error) {
      console.error('[CMS] Failed to load project:', error)
    }
  }

  async function initCategoryPage() {
    const slug = getSlugFromUrl()
    if (!slug) return

    if (!window.SanityCMS?.isConfigured()) {
      window.ProjectFallback?.renderCategory(slug)
      return
    }

    try {
      const [category, projects] = await Promise.all([
        SanityCMS.fetchSanity(CATEGORY_QUERY, {slug}),
        SanityCMS.fetchSanity(CATEGORY_PROJECTS_QUERY, {slug}),
      ])

      if (!category) return

      document.title = `${category.title} · Lydia Liu`
      document.getElementById('category-title').textContent = category.title

      const container = document.getElementById('category-projects')
      if (!container) return

      if (!projects?.length) {
        container.innerHTML =
          '<p class="text-gray-600">No projects in this category yet. Add them in Sanity Studio.</p>'
        return
      }

      if (projects.length === 1) {
        window.location.replace(`project.html?slug=${encodeURIComponent(projects[0].slug)}`)
        return
      }

      container.innerHTML = projects
        .map(
          (project) => `
          <a href="project.html?slug=${encodeURIComponent(project.slug)}" class="group block space-y-4">
            <div class="w-full aspect-[4/3] overflow-hidden rounded-sm shadow-xs">
              ${
                project.thumbnailUrl
                  ? `<img src="${project.thumbnailUrl}" alt="${SanityCMS.escapeHtml(project.title)}" class="w-full h-full object-cover transition group-hover:scale-[1.03] duration-300">`
                  : ''
              }
            </div>
            <h2 class="text-3xl font-gothic group-hover:opacity-70 transition">${SanityCMS.escapeHtml(project.title)}</h2>
            ${project.excerpt ? `<p class="text-sm text-gray-700 line-clamp-2">${SanityCMS.escapeHtml(project.excerpt)}</p>` : ''}
          </a>`
        )
        .join('')
    } catch (error) {
      console.error('[CMS] Failed to load category:', error)
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'project') initProjectPage()
    if (document.body.dataset.page === 'category') initCategoryPage()
  })
})()
