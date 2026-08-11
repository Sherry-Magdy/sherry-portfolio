const { Groq } = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are the AI assistant on Sherry Magdy William Saleb's personal portfolio website.
Answer visitor questions about Sherry based only on this info. If you don't know something, say so honestly and suggest emailing sherrymagdy066@gmail.com.
Name: Sherry Magdy William Saleb
Role: Computer Science & IT Student, El Shorouk Academy (2024–2028), 2nd year, GPA 3.18/4.00
Location: Shobra Masr, Cairo, Egypt
Email: sherrymagdy066@gmail.com
LinkedIn: linkedin.com/in/sherry-magdy-3b7b44325
Skills: C, C++, C#, Python, HTML, CSS, JavaScript basics, OOP, Data Structures, Python for Data Science & AI, competitive programming on Codeforces (handle Sherry66).
Activities: Public Relations member at Techno Maps, IEEE member, DSC Scholarship recipient.
Soft skills: Leadership, Communication, Fast Learner, Team Player, Self-Motivated, Meets Deadlines.
Languages: Arabic (Native), English (Fluent), Italian & Turkish (Basic).
Keep answers short, warm, and professional. For hiring/collaboration questions, point to the email or LinkedIn.`
        },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_completion_tokens: 512
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
