fetch('https://test.ce2s.net/Study.xml')
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "application/xml");
    const studies = xml.evaluate("//study", xml, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    // Create the table
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    const th1 = document.createElement("th");
    th1.textContent = "Title";
    trHead.appendChild(th1);
    const th2 = document.createElement("th");
    th2.textContent = "Description";
    trHead.appendChild(th2);
    const th3 = document.createElement("th");
    th3.textContent = "Location";
    trHead.appendChild(th3);
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    // Loop through each study and add a row to the table
    let study = studies.iterateNext();
    while (study) {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      td1.textContent = xml.evaluate("title", study, null, XPathResult.STRING_TYPE, null).stringValue;
      tr.appendChild(td1);
      const td2 = document.createElement("td");
      td2.textContent = xml.evaluate("description", study, null, XPathResult.STRING_TYPE, null).stringValue;
      tr.appendChild(td2);
      const td3 = document.createElement("td");
      td3.textContent = xml.evaluate("location", study, null, XPathResult.STRING_TYPE, null).stringValue;
      tr.appendChild(td3);
      tbody.appendChild(tr);

      study = studies.iterateNext();
    }

    table.appendChild(tbody);
    document.body.appendChild(table);

    // Export to CSV
    const exportButton = document.createElement("button");
    exportButton.textContent = "Export to CSV";
    exportButton.addEventListener("click", () => {
      const rows = Array.from(tbody.querySelectorAll("tr"));
      const csvContent = rows.map(row => Array.from(row.querySelectorAll("td")).map(td => td.textContent).join(",")).join("\n");
      const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "study.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    document.body.appendChild(exportButton);
  });