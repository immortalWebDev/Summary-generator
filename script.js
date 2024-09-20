document.addEventListener('DOMContentLoaded', function () {
	const searchButton = document.getElementById('searchButton');
	const clearButton = document.getElementById('clearButton');
	const topicInput = document.getElementById('topic');
	const summaryDiv = document.getElementById('summary');
	const downloadButton = document.getElementById('downloadButton');

	searchButton.addEventListener('click', function () {
		const topic = topicInput.value.trim();
		if (topic === '') {
			alert('Please enter a topic.');
			return;
		}
		fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`)
			.then(response => response.json())
			.then(data => {
				if (data.title && data.extract) {
					summaryDiv.innerHTML = `
						<h2 class="text-xl font-semibold mb-4">
							${data.title}
						</h2>
						<p>${data.extract}</p>
					`;
					downloadButton.classList.remove('hidden');
					downloadButton.addEventListener('click', function () {
						const blob = new Blob([data.extract], { type: 'text/plain' });
						const url = window.URL.createObjectURL(blob);
						const a = document.createElement('a');
						a.href = url;
						a.download = `${data.title}.txt`;
						document.body.appendChild(a);
						a.click();
						window.URL.revokeObjectURL(url);
						document.body.removeChild(a);
					});
				} else {
					summaryDiv.innerHTML = '<p>No summary found for the given topic.</p>';
					downloadButton.classList.add('hidden');
				}
			})
			.catch(error => {
				console.error('Error fetching Wikipedia data:', error);
				summaryDiv.innerHTML = `<p>Failed to fetch data. Please try again later.</p>`;
				downloadButton.classList.add('hidden');
			});
	});

	clearButton.addEventListener('click', function () {
		topicInput.value = '';
		summaryDiv.innerHTML = '';
		downloadButton.classList.add('hidden');
	});
});
