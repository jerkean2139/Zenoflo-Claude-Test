// Survey data submission handler
async function submitSurveyData(surveyData) {
    try {
        // Replace with your actual API endpoint
        const response = await fetch('https://api.zenoflo.com/survey/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                data: surveyData,
                source: 'bot-mob-survey'
            })
        });

        if (!response.ok) {
            throw new Error('Survey submission failed');
        }

        const result = await response.json();
        return {
            success: true,
            surveyId: result.surveyId
        };
    } catch (error) {
        console.error('Error submitting survey:', error);
        
        // Fallback to local storage if API fails
        const fallbackData = {
            timestamp: new Date().toISOString(),
            data: surveyData,
            id: Math.random().toString(36).substr(2, 9)
        };
        
        // Store in local storage as backup
        const existingData = JSON.parse(localStorage.getItem('pendingSurveys') || '[]');
        existingData.push(fallbackData);
        localStorage.setItem('pendingSurveys', JSON.stringify(existingData));
        
        return {
            success: false,
            error: error.message,
            fallbackId: fallbackData.id
        };
    }
}

// Function to retry failed submissions
async function retryFailedSubmissions() {
    const pendingSurveys = JSON.parse(localStorage.getItem('pendingSurveys') || '[]');
    if (pendingSurveys.length === 0) return;

    const successfulRetries = [];
    
    for (const survey of pendingSurveys) {
        try {
            const response = await submitSurveyData(survey.data);
            if (response.success) {
                successfulRetries.push(survey.id);
            }
        } catch (error) {
            console.error('Retry failed for survey:', survey.id);
        }
    }

    // Remove successful retries from local storage
    if (successfulRetries.length > 0) {
        const remainingPending = pendingSurveys.filter(
            survey => !successfulRetries.includes(survey.id)
        );
        localStorage.setItem('pendingSurveys', JSON.stringify(remainingPending));
    }
}

export { submitSurveyData, retryFailedSubmissions };