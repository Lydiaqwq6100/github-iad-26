import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

loadEnv()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || projectId === 'YOUR_PROJECT_ID' || projectId.includes('_')) {
  console.error(
    'Set a valid SANITY_STUDIO_PROJECT_ID in studio/.env (letters, numbers, dashes only).'
  )
  console.error('Find it at https://sanity.io/manage → your project → Project ID')
  process.exit(1)
}

if (!token || token.includes('your_write_token')) {
  console.error('Set SANITY_API_TOKEN in studio/.env before running seed.')
  console.error('Create one at https://sanity.io/manage → your project → API → Tokens (Editor role)')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function uploadImage(relativePath, label) {
  const filePath = path.join(rootDir, relativePath)
  if (!fs.existsSync(filePath)) {
    console.warn(`Skipping missing file: ${relativePath}`)
    return undefined
  }

  const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  })
  console.log(`Uploaded ${label}: ${relativePath}`)
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

async function uploadFile(relativePath, label) {
  const filePath = path.join(rootDir, relativePath)
  if (!fs.existsSync(filePath)) {
    console.warn(`Skipping missing file: ${relativePath}`)
    return undefined
  }

  const asset = await client.assets.upload('file', fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  })
  console.log(`Uploaded ${label}: ${relativePath}`)
  return {_type: 'file', asset: {_type: 'reference', _ref: asset._id}}
}

function block(text) {
  return {
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', text, marks: []}],
  }
}

async function seed() {
  console.log('Seeding portfolio content into Sanity…')

  const [
    heroImage,
    navIcon,
    backgroundImage,
    aboutPhoto,
    worksProduct,
    worksJewellery,
    worksEvents,
    makan1Preview,
    makan2Preview,
    sheng1Preview,
    sheng2Preview,
    waterDay1,
    waterDay2,
    waterDay3,
    makan1Pdf,
    makan2Pdf,
    sheng1Pdf,
    sheng2Pdf,
  ] = await Promise.all([
    uploadImage('未命名作品 3.PNG', 'hero image'),
    uploadImage('未命名作品.png', 'nav icon'),
    uploadImage('未命名作品 2.png', 'background'),
    uploadImage('about-photo.png', 'about photo'),
    uploadImage('works-product.png', 'product category'),
    uploadImage('works-jewellery.png', 'jewellery category'),
    uploadImage('works-events.png', 'events category'),
    uploadImage('Product design/makan-1-preview.png', 'makan 1 preview'),
    uploadImage('Product design/makan-2-preview.png', 'makan 2 preview'),
    uploadImage('Jewellery design/sheng-1-preview.png', 'sheng 1 preview'),
    uploadImage('Jewellery design/sheng-2-preview.png', 'sheng 2 preview'),
    uploadImage('Events and exhibitions/Water Day 1.jpg', 'water day 1'),
    uploadImage('Events and exhibitions/Water Day 2.jpg', 'water day 2'),
    uploadImage('Events and exhibitions/Water Day 3.jpg', 'water day 3'),
    uploadFile('Product design/Makan 1.pdf', 'makan 1 pdf'),
    uploadFile('Product design/Makan 2.pdf', 'makan 2 pdf'),
    uploadFile('Jewellery design/Sheng 1.pdf', 'sheng 1 pdf'),
    uploadFile('Jewellery design/Sheng 2.pdf', 'sheng 2 pdf'),
  ])

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Lydia Liu',
    heroTagline: 'Get to know me and my work ♡',
    heroImage,
    navIcon,
    backgroundImage,
    aboutPhoto,
    aboutBio:
      'A well-versed and passionate individual who is willing to adapt to different environments and try out new things. Fluent in both English and Chinese, I love conversing with different types of people, whilst exploring various design potential wth them. With a passion in social phenomenons, I always aim to immerse myself in various experiences to hone my skills at designing with compassion. I always thrive to achieve care for minorities, especially in my product design works.',
    email: 'liu.yibai@mylasalle.edu.sg',
    instagramHandle: 'lybzzzzzzz',
    instagramUrl: 'https://instagram.com/lybzzzzzzz',
    education: [
      {
        _key: 'edu1',
        period: '2025~',
        title: 'BA (Hons) Design for Social Future',
        institution: '(UAS) Lasalle College of the Arts',
      },
      {
        _key: 'edu2',
        period: '2022-2025',
        title: 'Diploma in 3D Design (Object & Jewellery)',
        institution: 'Nanyang Academy of Fine Arts',
      },
      {
        _key: 'edu3',
        period: '2015 - 2021',
        title: 'Junior College Graduate',
        institution: 'Dunman High School',
      },
    ],
  })

  const categories = [
    {
      _id: 'category-product-design',
      title: 'Product Designs',
      slug: {current: 'product-design'},
      thumbnail: worksProduct,
      order: 1,
    },
    {
      _id: 'category-jewellery-design',
      title: 'Jewellery Practices',
      slug: {current: 'jewellery-design'},
      thumbnail: worksJewellery,
      order: 2,
    },
    {
      _id: 'category-events-exhibitions',
      title: 'Events & Exhibitions',
      slug: {current: 'events-exhibitions'},
      thumbnail: worksEvents,
      order: 3,
    },
  ]

  for (const category of categories) {
    await client.createOrReplace({_type: 'workCategory', ...category})
  }

  const projects = [
    {
      _id: 'project-makan-lah',
      title: 'Makan Lah!',
      slug: {current: 'makan-lah'},
      category: {_type: 'reference', _ref: 'category-product-design'},
      description: [
        block(
          'The issue regarding ageing population is slowly but surely becoming more and more prominent in Singapore. In this project, I explored the topic of geriatric depression and invented a game about nostalgic local Singaporean dishes. This game is similar to, but easier than many elderly\'s favourit game, Mahjong. Thus, it can be played betwen elderly, or with their children. This game is also in line with the Ministry of Health\'s aim of promoting healthy eating .'
        ),
      ],
      awardNote: '*This project has won the Most Creative Award by Nanyang Academy of Fine Arts in 2025.',
      gallery: [
        {
          _key: 'makan1',
          title: 'Makan 1',
          image: makan1Preview,
          linkLabel: 'Open Makan 1 in a new tab',
          file: makan1Pdf,
        },
        {
          _key: 'makan2',
          title: 'Makan 2',
          image: makan2Preview,
          linkLabel: 'Open Makan 2 in a new tab',
          file: makan2Pdf,
        },
      ],
      order: 1,
      published: true,
    },
    {
      _id: 'project-sheng',
      title: 'Sheng',
      slug: {current: 'sheng'},
      category: {_type: 'reference', _ref: 'category-jewellery-design'},
      description: [
        block(
          '“Sheng” in this case refers to the Chinese word, “生”, which embodies the growth pains (生长痛) and fertility pains (生育痛) of a woman. Made with hardware store materials that are easily accessible, thiswork represents the blood, sweat and tears a woman has to go through throughout their lifespan.'
        ),
      ],
      awardNote: '* Selected for display at the NAFA project library',
      gallery: [
        {
          _key: 'sheng1',
          title: 'Sheng 1',
          image: sheng1Preview,
          linkLabel: 'Open Sheng 1 in a new tab',
          file: sheng1Pdf,
        },
        {
          _key: 'sheng2',
          title: 'Sheng 2',
          image: sheng2Preview,
          linkLabel: 'Open Sheng 2 in a new tab',
          file: sheng2Pdf,
        },
      ],
      order: 1,
      published: true,
    },
    {
      _id: 'project-make-every-drop-count',
      title: 'Exhibition "Make Every Drop Count"',
      slug: {current: 'make-every-drop-count'},
      category: {_type: 'reference', _ref: 'category-events-exhibitions'},
      description: [
        block(
          'Lydia took part in designing and creating an art installation at NAFA campus 1 along Bencoolen Street to spread the word for water conservation. This porject was done along with 5 other students.'
        ),
        block(
          'This installation comprises multiple water droplets of various sizes made from upcycled materials. In line with the theme of sustainability, LED neon light panels from a previous installation was incorporated as part of the creative presentation.'
        ),
      ],
      gallery: [
        {
          _key: 'water1',
          image: waterDay1,
          linkLabel: 'Open image in a new tab',
        },
        {
          _key: 'water2',
          image: waterDay2,
          linkLabel: 'Open image in a new tab',
        },
        {
          _key: 'water3',
          image: waterDay3,
          linkLabel: 'Open image in a new tab',
        },
      ],
      order: 1,
      published: true,
    },
  ]

  for (const project of projects) {
    await client.createOrReplace({_type: 'project', ...project})
  }

  console.log('\nSeed complete!')
  console.log('Next steps:')
  console.log('1. Copy your project ID into js/config.js')
  console.log('2. Run "npm run dev" in the studio folder to edit content')
  console.log('3. Open index.html in a browser (or use a local server)')
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
