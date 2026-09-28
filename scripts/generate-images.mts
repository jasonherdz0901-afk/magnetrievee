import { GoogleGenAI } from '@google/genai'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const ai = new GoogleGenAI({
  apiKey: process.env.NETLIFY_AI_GATEWAY_KEY,
  httpOptions: {
    baseUrl: process.env.NETLIFY_AI_GATEWAY_BASE_URL?.replace(/\/$/, ''),
  },
})

const OUT_DIR = path.join(process.cwd(), 'public', 'img')

const jobs = [
  {
    file: 'magnetrieve-hero.png',
    prompt:
      'Wide cinematic product-render photograph of a rugged rectangular ground rover robot named Magnetrieve, shot on location in a dim industrial scrapyard bay at dusk. The robot has thick black rubber tank treads, a graphite-and-burnt-orange brushed-metal chassis, exposed rivets and cable conduits. Mounted on top is a jointed three-segment robotic arm made of dark anodized aluminum, extending forward and down, holding a cylindrical copper-wound solenoid electromagnet coil close to a scatter of rusty bolts, nails and metal scrap on the concrete floor. A metal collector bin with a hinged lid sits at the rear of the chassis, glowing faintly amber from an internal status light. Small amber and teal LED indicator strips line the chassis edges. Camera at a low three-quarter angle, shallow depth of field, volumetric dust in the air, warm amber key light from the left and cool teal rim light from the right, photorealistic, highly detailed, 35mm lens look, no text, no logos, no watermark.',
    aspect: '16:9',
  },
  {
    file: 'magnetrieve-arm-detail.png',
    prompt:
      'Extreme close-up photorealistic product shot of the business end of a robotic arm: a dark anodized aluminum wrist joint holding a cylindrical copper-wound electromagnet solenoid, actively lifting a handful of rusty metal bolts and washers that cling to its underside, tiny visible magnetic attraction. Background is a blurred dim workshop with soft amber and teal bokeh lights. Dramatic side lighting emphasizing the copper coil windings and brushed metal joint, shallow depth of field, photorealistic, highly detailed, no text, no logos, no watermark.',
    aspect: '4:3',
  },
] as const

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  for (const job of jobs) {
    console.log(`Generating ${job.file}...`)
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: job.prompt,
      config: {
        imageConfig: { aspectRatio: job.aspect },
      },
    } as any)

    const parts = response.candidates?.[0]?.content?.parts ?? []
    const imagePart = parts.find((p: any) => p.inlineData)
    if (!imagePart?.inlineData?.data) {
      console.error(`No image returned for ${job.file}`, JSON.stringify(response).slice(0, 500))
      continue
    }
    const buffer = Buffer.from(imagePart.inlineData.data, 'base64')
    await writeFile(path.join(OUT_DIR, job.file), buffer)
    console.log(`Saved ${job.file} (${buffer.length} bytes)`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
