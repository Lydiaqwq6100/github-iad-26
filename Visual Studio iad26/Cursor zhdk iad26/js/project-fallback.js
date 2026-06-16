(function () {
  const FALLBACK_PROJECTS = {
    'makan-lah': {
      title: 'Makan Lah!',
      categoryTitle: 'Product Designs',
      description: `<p>The issue regarding ageing population is slowly but surely becoming more and more prominent in Singapore. In this project, I explored the topic of geriatric depression and invented a game about nostalgic local Singaporean dishes. This game is similar to, but easier than many elderly's favourit game, Mahjong. Thus, it can be played betwen elderly, or with their children. This game is also in line with the Ministry of Health's aim of promoting healthy eating .</p>`,
      awardNote:
        '*This project has won the Most Creative Award by Nanyang Academy of Fine Arts in 2025.',
      gallery: [
        {
          title: 'Makan 1',
          imageUrl: 'Product design/makan-1-preview.png',
          linkLabel: 'Open Makan 1 in a new tab',
          linkUrl: 'Product design/Makan 1.pdf',
        },
        {
          title: 'Makan 2',
          imageUrl: 'Product design/makan-2-preview.png',
          linkLabel: 'Open Makan 2 in a new tab',
          linkUrl: 'Product design/Makan 2.pdf',
        },
      ],
    },
    sheng: {
      title: 'Sheng',
      categoryTitle: 'Jewellery Practices',
      description: `<p>“Sheng” in this case refers to the Chinese word, “生”, which embodies the growth pains (生长痛) and fertility pains (生育痛) of a woman. Made with hardware store materials that are easily accessible, thiswork represents the blood, sweat and tears a woman has to go through throughout their lifespan.</p>`,
      awardNote: '* Selected for display at the NAFA project library',
      gallery: [
        {
          title: 'Sheng 1',
          imageUrl: 'Jewellery design/sheng-1-preview.png',
          linkLabel: 'Open Sheng 1 in a new tab',
          linkUrl: 'Jewellery design/Sheng 1.pdf',
        },
        {
          title: 'Sheng 2',
          imageUrl: 'Jewellery design/sheng-2-preview.png',
          linkLabel: 'Open Sheng 2 in a new tab',
          linkUrl: 'Jewellery design/Sheng 2.pdf',
        },
      ],
    },
    'make-every-drop-count': {
      title: 'Exhibition "Make Every Drop Count"',
      categoryTitle: 'Events & Exhibitions',
      description: `<p>Lydia took part in designing and creating an art installation at NAFA campus 1 along Bencoolen Street to spread the word for water conservation. This porject was done along with 5 other students.</p><p>This installation comprises multiple water droplets of various sizes made from upcycled materials. In line with the theme of sustainability, LED neon light panels from a previous installation was incorporated as part of the creative presentation.</p>`,
      gallery: [
        {
          imageUrl: 'Events and exhibitions/Water Day 1.jpg',
          linkLabel: 'Open image in a new tab',
          linkUrl: 'Events and exhibitions/Water Day 1.jpg',
        },
        {
          imageUrl: 'Events and exhibitions/Water Day 2.jpg',
          linkLabel: 'Open image in a new tab',
          linkUrl: 'Events and exhibitions/Water Day 2.jpg',
        },
        {
          imageUrl: 'Events and exhibitions/Water Day 3.jpg',
          linkLabel: 'Open image in a new tab',
          linkUrl: 'Events and exhibitions/Water Day 3.jpg',
        },
      ],
    },
  }

  const FALLBACK_CATEGORIES = {
    'product-design': {title: 'Product Designs', projects: ['makan-lah']},
    'jewellery-design': {title: 'Jewellery Practices', projects: ['sheng']},
    'events-exhibitions': {title: 'Events & Exhibitions', projects: ['make-every-drop-count']},
  }

  function renderProject(project) {
    document.title = `${project.title} · Lydia Liu`
    document.getElementById('project-category').textContent = project.categoryTitle
    document.getElementById('project-title').textContent = project.title
    document.getElementById('project-description').innerHTML = project.description

    const awardEl = document.getElementById('project-award')
    if (project.awardNote) {
      awardEl.textContent = project.awardNote
      awardEl.classList.remove('hidden')
    }

    const container = document.getElementById('project-gallery')
    container.innerHTML = project.gallery
      .map((item) => {
        const titleHtml = item.title
          ? `<h2 class="text-2xl font-gothic mb-4">${item.title}</h2>`
          : ''
        const link = item.linkUrl || item.imageUrl
        return `<section>
          ${titleHtml}
          <img src="${item.imageUrl}" alt="${item.title || 'Project preview'}" class="preview-img">
          ${
            item.linkLabel
              ? `<p class="mt-4 text-sm"><a href="${link}" target="_blank" rel="noopener noreferrer" class="underline hover:text-pink-600 transition">${item.linkLabel}</a></p>`
              : ''
          }
        </section>`
      })
      .join('')
  }

  window.ProjectFallback = {
    renderProject(slug) {
      const project = FALLBACK_PROJECTS[slug]
      if (!project) return false
      renderProject(project)
      return true
    },
    renderCategory(slug) {
      const category = FALLBACK_CATEGORIES[slug]
      if (!category) return false

      if (category.projects.length === 1) {
        window.location.replace(`project.html?slug=${encodeURIComponent(category.projects[0])}`)
        return true
      }

      document.title = `${category.title} · Lydia Liu`
      document.getElementById('category-title').textContent = category.title
      return true
    },
  }
})()
