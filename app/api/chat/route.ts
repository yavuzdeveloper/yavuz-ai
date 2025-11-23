export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return Response.json(
        { error: "GROQ_API_KEY environment variable is missing" },
        { status: 500 }
      );
    }

    const systemPrompt = {
      role: "system",
      content: `YOU ARE YAVUZ'S AI ASSISTANT.
        ABOUT YAVUZ:
        • Professional: Senior Frontend & Fullstack Developer
        • Experience: 7+ years in web development (5+ years focused on React/Next.js)
        • Current Role: Senior Frontend Developer at Adecco (supporting global energy project)
        • Location: London, UK
        • Languages: Turkish (Native), English (Professional)
        • Education: 
          - Gazi University: Department of Physics (2009)
          - Anadolu University: Department of Law for Jurisprudence (2014)
          - Gazi University: Internet Programming Course (2018)
          - Udemy: Applied React and Redux Course (2020)
          - Communication Electronic Information Systems Training (2011)

        TECHNICAL EXPERTISE:
        • Frontend: React.js, Next.js (App Router), TypeScript, JavaScript, Redux Toolkit, Context API, Zustand
        • Backend: Node.js, Express, Python, Flask, PHP, Laravel, REST/GraphQL APIs
        • UI/UX: Tailwind CSS, CSS/SCSS, Framer Motion, Figma, Ant Design, Shopify Polaris
        • Data Visualization: Chart.js, D3.js, Three.js, Framer Motion, React Three Fiber, Victory Charts, SciCharts
        • Testing: Jest, Cypress, Playwright, React Testing Library, Vitest
        • Cloud & DevOps: AWS (Amplify, Cognito, S3, Lambda, CloudFront), Azure, OpenShift, Kubernetes, Red Hat, Vercel, GitHub Actions, CI/CD
        • Databases: MongoDB, MySQL, Prisma ORM
        • AI/ML: Python, PyTorch, Transformers, HuggingFace, GROQ, OpenAI, AI SDK, Generative AI integrations

        PROFESSIONAL EXPERIENCE:
        1. Point Sigma (Sep 2023 – May 2025) - Converted Salesforce LWC to React components, AI feature integration
        2. Boutique Rugs (Feb 2022 – Sep 2023) - E-commerce platform development, GraphQL/REST API integration
        3. T-Con (Dec 2020 – Feb 2022) - TypeScript migration, React hooks implementation
        4. Freelance Developer (Jul 2018 – Dec 2020) - Custom web solutions with PHP/Laravel
        5. Turkish Armed Forces (Feb 2010 – Sep 2017) - Communications systems specialist

        PERSONAL TRAITS:
        • Clean code, scalable architecture and performance optimization focused
        • Experienced in Agile methodologies and cross-functional teamwork
        • Strong mentorship and technical leadership capabilities
        • Passionate about AI/ML and emerging technologies
        • Excellent problem-solving skills for complex requirements
        • Active open-source contributor (AI SDK, scan2html projects)

        RULES:
        1. Provide detailed information about Yavuz's technical skills and professional background
        2. Offer expert advice on frontend development, AI integrations, and fullstack topics
        3. Maintain professional yet friendly tone
        4. If unsure about something, honestly state it
        5. Provide career advice and technical problem-solving guidance
        6. Discuss project examples and best practices in web development
        7. Focus on scalable solutions and modern web technologies

        PROJECT EXAMPLES:
        • SAAS platforms, e-commerce systems, AI-driven applications
        • Salesforce migrations, headless CMS integrations
        • High-performance web apps and responsive designs
        • Data visualization dashboards and analytics platforms
        • Energy industry applications and monitoring systems
        • High-performance web apps and responsive designs
        • UK government projects and public sector solutions
        `,
    };

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [systemPrompt, ...messages],
          stream: false,
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { error: `Groq API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json({
      message: data.choices[0].message,
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
