import { Aiintermedi } from "./Child/Ai4";


export class AiAdvance extends Aiintermedi {

    constructor() {

    }
    addFact(fact, metadata = true) {
        if (!fact) throw new Error('Fact is required');
        const key = typeof fact === 'string' ? fact : JSON.stringify(fact);
        this.facts.set(key, metadata);
        return key;
    }

    addFacts(facts) {
        if (!Array.isArray(facts)) return;
        for (const fact of facts) {
            this.addFact(fact);
        }
    }

    hasFact(fact) {
        const key = typeof fact === 'string' ? fact : JSON.stringify(fact);
        return this.facts.has(key);
    }

    getFact(fact) {
        const key = typeof fact === 'string' ? fact : JSON.stringify(fact);
        return this.facts.get(key);
    }

    retractFact(fact) {
        const key = typeof fact === 'string' ? fact : JSON.stringify(fact);
        return this.facts.delete(key);
    }

    addRule(name, antecedent, consequent, options = {}) {
        if (!name || !antecedent || !consequent) {
            throw new Error('Rule name, antecedent and consequent are required');
        }
        this.rules.push({
            name,
            antecedent,
            consequent,
            priority: options.priority || 0,
            action: options.action || null,
            once: options.once || false,
            applied: false,
            metadata: options.metadata || {}
        });
    }

    getRules() {
        return [...this.rules];
    }

    evaluateCondition(condition) {
        if (typeof condition === 'function') {
            return condition(this);
        }

        if (typeof condition === 'string') {
            return this.hasFact(condition);
        }

        if (Array.isArray(condition)) {
            return condition.every(term => this.evaluateCondition(term));
        }

        if (condition && typeof condition === 'object') {
            if ('not' in condition) {
                return !this.evaluateCondition(condition.not);
            }
            if ('any' in condition) {
                return Array.isArray(condition.any) && condition.any.some(term => this.evaluateCondition(term));
            }
            if ('all' in condition) {
                return Array.isArray(condition.all) && condition.all.every(term => this.evaluateCondition(term));
            }
        }

        return false;
    }

    infer(initialFacts = [], options = {}) {
        this.inferenceHistory = [];
        this.addFacts(initialFacts);

        const maxIterations = options.maxIterations || 50;
        let changed = true;
        let iteration = 0;

        while (changed && iteration < maxIterations) {
            changed = false;
            iteration += 1;
            const sortedRules = [...this.rules].sort((a, b) => b.priority - a.priority);

            for (const rule of sortedRules) {
                if (rule.once && rule.applied) continue;
                const conditionMet = this.evaluateCondition(rule.antecedent);

                if (!conditionMet) continue;

                const consequents = Array.isArray(rule.consequent) ? rule.consequent : [rule.consequent];
                let ruleFired = false;

                for (const consequent of consequents) {
                    const key = typeof consequent === 'string' ? consequent : JSON.stringify(consequent);
                    if (!this.facts.has(key)) {
                        this.facts.set(key, rule.metadata || true);
                        ruleFired = true;
                        changed = true;
                        this.inferenceHistory.push({
                            rule: rule.name,
                            antecedent: rule.antecedent,
                            consequent,
                            iteration,
                            timestamp: new Date().toISOString()
                        });
                    }
                }

                if (ruleFired && typeof rule.action === 'function') {
                    rule.action(this);
                }

                if (ruleFired) {
                    rule.applied = true;
                }
            }
        }

        return {
            facts: Array.from(this.facts.keys()),
            inferenceHistory: [...this.inferenceHistory],
            iterations: iteration
        };
    }

    query(predicate) {
        if (!predicate) {
            return Array.from(this.facts.entries()).map(([fact, metadata]) => ({ fact, metadata }));
        }

        return Array.from(this.facts.entries())
            .filter(([fact]) => fact.includes(predicate))
            .map(([fact, metadata]) => ({ fact, metadata }));
    }

    explain(fact) {
        const key = typeof fact === 'string' ? fact : JSON.stringify(fact);
        return this.inferenceHistory.filter(entry => {
            const consequent = typeof entry.consequent === 'string' ? entry.consequent : JSON.stringify(entry.consequent);
            return consequent === key;
        });
    }

    reset() {
        this.facts.clear();
        this.rules = [];
        this.inferenceHistory = [];
    }
}