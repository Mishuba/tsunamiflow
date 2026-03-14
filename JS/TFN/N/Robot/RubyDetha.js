// RubyDetha.js
export class RubyDetha {
    /**
     * @param {string} formId - ID of the form element
     * @param {string} outputId - ID of the element to display output
     * @param {string} submitBtnId - ID of the submit button
     * @param {string} apiUrl - API endpoint to send the data to
     */
    constructor(formId, outputId, submitBtnId, apiUrl) {
        this.form = document.getElementById(formId);
        this.output = document.getElementById(outputId);
        this.submitBtn = document.getElementById(submitBtnId);
        this.apiUrl = apiUrl;

        if (!this.form || !this.output || !this.submitBtn) {
            throw new Error('Form, output, or submit button not found');
        }

        this.fields = {}; // Will store field references dynamically
        this.initFields();
        this.bindForm();
    }

    // Automatically grabs all input and textarea fields in the form
    initFields() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            this.fields[input.id] = input;
        });
    }

    // Collects the values dynamically from all fields
    getPayload() {
        const payload = {};
        for (const [key, el] of Object.entries(this.fields)) {
            payload[key] = el.value.trim();
        }
        return payload;
    }

    // Handles the actual submit logic
    async submitJob() {
        this.submitBtn.disabled = true;
        this.output.textContent = "Launching job...";

        const payload = this.getPayload();

        try {
            const res = await fetch(this.apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            // Read body once
            const raw = await res.text();
            let data;
            try {
                data = JSON.parse(raw);
            } catch {
                data = raw;
            }

            if (!res.ok) throw data;

            this.output.textContent = JSON.stringify(data, null, 2);
        } catch (err) {
            this.output.textContent =
                typeof err === "string" ? err : JSON.stringify(err, null, 2);
        } finally {
            this.submitBtn.disabled = false;
        }
    }

    // Binds the submit event to the form
    bindForm() {
        this.form.addEventListener("submit", e => {
            e.preventDefault();
            this.submitJob();
        });
    }
}