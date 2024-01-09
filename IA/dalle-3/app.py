import constants
import os

from flask import Flask, request, jsonify
from flask_cors import CORS
os.environ["OPENAI_API_KEY"] = constants.APIKEY
from openai import OpenAI

app = Flask(__name__)
CORS(app)

def get_image(prompt_arg):
  client = OpenAI()
  response = client.images.generate(
    model="dall-e-3",
    prompt=prompt_arg,
    size="1024x1024",
    quality="hd",
    n=1,
  )
  image_url = response.data[0].url
  return image_url

@app.route('/api/infographic', methods=['POST'])
def api_ask():
      if request.method == 'POST':
        data = request.get_json()
        prompt_arg = data.get('prompt', None)
        if prompt_arg is None:
            return jsonify({'error': 'Missing prompt in request'})
        result = get_image(prompt_arg)
        return jsonify({'image_url': result})
      else:
        return jsonify({'error': 'Invalid request method'})

if __name__ == '__main__':
    chat_history = []
    app.run(host='0.0.0.0', port=5001)

# Create an infographic illustrating the impact of COVID-19 on inequality and poverty, based on the document by Oxfam Intermón. Use a clean and professional layout with visually appealing elements. Include key statistics and data on the impact of the pandemic, emphasizing the disparities it has exacerbated. Highlight the contributions and collaboration of experts, academics, and organizations in the research process. Incorporate the Oxfam Intermón logo and contact information for further inquiries.


# Create an infographic for a blog post. Here is the visual description of the infographic:  Title: "Saving Lives with Clean Water: Oxfam's Efforts on World Day of Water" Main Visual Elements: 1. A vibrant and clean water droplet as the central visual element to represent the importance of water. 2. Illustrations or icons depicting various water-related activities such as drinking, sanitation, hygiene, and water provision. 3. Use of colors that evoke a sense of freshness and cleanliness, such as shades of blue and green. 4. Images of people from different communities and regions, showcasing their daily struggles and the impact of Oxfam's initiatives. Layout and Structure: 1. Start with an eye-catching title and subtitle, clearly stating the focus of the infographic. 2. Divide the content into sections, each highlighting a key aspect of Oxfam's efforts on World Day of Water. 3. Use concise and informative headings to guide the reader through the sections. 4. Include statistics, facts, and figures in visually appealing formats, such as charts or graphs, to convey the impact of Oxfams work. 5. Incorporate quotes or testimonials from individuals who have benefited from Oxfam's water projects. 6. Conclude with a call-to-action, encouraging viewers to support Oxfam's initiatives or get involved in their own communities. Style Preferences: 1. Clean, modern, and minimalist design. 2. Use of clear and legible fonts, with font sizes that are easily readable. 3. Balance between text and visuals, ensuring that the infographic is visually engaging while conveying essential information. 4. Consistency in visual style throughout the infographic, maintaining a cohesive look and feel. 5. Incorporation of Oxfam's branding elements, such as their logo and color scheme, to maintain a connection with the organization.