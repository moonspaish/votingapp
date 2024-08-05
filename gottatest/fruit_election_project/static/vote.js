document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector('.toggle-button');
    const navbarLinks = document.querySelector('.navbar-links');

    toggleButton.addEventListener('click', () => {
        navbarLinks.classList.toggle('active');
    });

    // Assuming 'plot_data' contains the JSON data of candidate counts passed from Django
    const plotData = JSON.parse('{{ plot_data| escapejs}}');

    // Debug: Log the data to check the structure
    console.log(plotData);

    // Set up SVG dimensions and margins
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Append SVG and group for the histogram
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X and Y scales
    const x = d3.scaleBand()
        .domain(plotData.map(d => d.choice))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(plotData, d => d.votes)])
        .nice()
        .range([height, 0]);

    // Bars
    svg.selectAll(".bar")
        .data(plotData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.choice))
        .attr("y", d => y(d.votes))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.votes));

    // X-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Y-axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Axis labels and title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 10)
        .style("text-anchor", "middle")
        .text("Candidates");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Votes Count");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Votes Histogram");
});
