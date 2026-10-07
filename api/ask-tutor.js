export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { question } = req.body || {};

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a Physics question."
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          instructions:
            "You are PhysicsPathAI, an expert Physics tutor for CBSE, HP Board, NEET and JEE students. Explain Physics clearly and step-by-step. For numerical problems, show the formula, substitution, calculation and final answer with units. Keep explanations student-friendly.",
          input: question
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return res.status(response.status).json({
        error: "AI service error."
      });
    }

    return res.status(200).json({
      answer: data.output_text
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
}
