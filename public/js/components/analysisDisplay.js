// Renders the analysis report in a structured format
export function renderAnalysis(analysisText) {
    try {
      const reportElement = document.getElementById('report');
      
      // Extract sections using regex
      const sections = {
        ratings: [...analysisText.matchAll(/(\d+)\. ([^(]+) \((\d+)\/10\)/g)],
        strengths: extractSection(analysisText, 'Key strengths:', 'Areas for improvement:'),
        improvements: extractSection(analysisText, 'Areas for improvement:', 'Overall rating:'),
        overall: analysisText.match(/Overall rating: (\d+)\/10/)?.[1] || 'N/A'
      };
  
      reportElement.innerHTML = `
        <div class="analysis-report">
          <h2 class="text-xl font-bold mb-4">Analysis Report</h2>
          
          <div class="ratings mb-4">
            ${sections.ratings.map(([, num, category, score]) => `
              <div class="rating-item flex justify-between py-2">
                <span class="font-medium">${num}. ${category.trim()}</span>
                <span class="score">${score}/10</span>
              </div>
            `).join('')}
          </div>
  
          <div class="strengths mb-4">
            <h3 class="font-semibold mb-2">Key Strengths:</h3>
            <ul class="list-disc pl-5">
              ${formatBulletPoints(sections.strengths)}
            </ul>
          </div>
  
          <div class="improvements mb-4">
            <h3 class="font-semibold mb-2">Areas for Improvement:</h3>
            <ul class="list-disc pl-5">
              ${formatBulletPoints(sections.improvements)}
            </ul>
          </div>
  
          <div class="overall mt-4 pt-4 border-t">
            <span class="font-semibold">Overall Rating:</span>
            <span class="text-lg ml-2">${sections.overall}/10</span>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error rendering analysis:', error);
      document.getElementById('report').innerHTML = `
        <div class="error-message text-red-600">
          Error rendering analysis. Please try again.
        </div>
      `;
    }
  }
  
  function extractSection(text, startMarker, endMarker) {
    const start = text.indexOf(startMarker) + startMarker.length;
    const end = text.indexOf(endMarker);
    return text.slice(start, end).trim();
  }
  
  function formatBulletPoints(text) {
    return text
      .split('\n')
      .map(point => point.trim())
      .filter(point => point.startsWith('-'))
      .map(point => `<li>${point.substring(1).trim()}</li>`)
      .join('');
  }