// ===== MATHEMATICAL CALCULATIONS ENGINE =====

export class MathematicalCalculations {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.precision = 2;
    }

    // ===== CORE CALCULATION METHODS =====

    calculatePercentage(value, total, precision = this.precision) {
        if (!total || total === 0) return 0;
        return parseFloat(((value / total) * 100).toFixed(precision));
    }

    calculateAverage(values, precision = this.precision) {
        if (!Array.isArray(values) || values.length === 0) return 0;
        const sum = values.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
        return parseFloat((sum / values.length).toFixed(precision));
    }

    calculateMedian(values) {
        if (!Array.isArray(values) || values.length === 0) return 0;
        const sorted = values.map(v => parseFloat(v) || 0).sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 
            ? (sorted[mid - 1] + sorted[mid]) / 2 
            : sorted[mid];
    }

    calculateStandardDeviation(values, precision = this.precision) {
        if (!Array.isArray(values) || values.length === 0) return 0;
        const avg = this.calculateAverage(values);
        const squaredDiffs = values.map(v => Math.pow((parseFloat(v) || 0) - avg, 2));
        const avgSquaredDiff = this.calculateAverage(squaredDiffs);
        return parseFloat(Math.sqrt(avgSquaredDiff).toFixed(precision));
    }

    // ===== STUDENT PERFORMANCE CALCULATIONS =====

    calculateStudentProgress(completedLessons, totalLessons) {
        return this.calculatePercentage(completedLessons, totalLessons);
    }

    calculateEngagementScore(timeSpent, expectedTime, interactions, expectedInteractions) {
        const timeScore = Math.min(timeSpent / expectedTime, 1.5) * 50; // Max 75 points
        const interactionScore = Math.min(interactions / expectedInteractions, 1.5) * 50; // Max 75 points
        return Math.min(timeScore + interactionScore, 100);
    }

    calculateRiskLevel(progress, engagement, lastActivity) {
        const progressWeight = 0.4;
        const engagementWeight = 0.4;
        const activityWeight = 0.2;

        const daysSinceActivity = (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24);
        const activityScore = Math.max(0, 100 - (daysSinceActivity * 10));

        const riskScore = (progress * progressWeight) + (engagement * engagementWeight) + (activityScore * activityWeight);

        if (riskScore >= 70) return 'low';
        if (riskScore >= 40) return 'medium';
        return 'high';
    }

    // ===== ASSESSMENT CALCULATIONS =====

    calculateGradeDistribution(scores) {
        const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
        
        scores.forEach(score => {
            if (score >= 90) distribution.A++;
            else if (score >= 80) distribution.B++;
            else if (score >= 70) distribution.C++;
            else if (score >= 60) distribution.D++;
            else distribution.F++;
        });

        return distribution;
    }

    calculatePassRate(scores, passingScore = 60) {
        if (!Array.isArray(scores) || scores.length === 0) return 0;
        const passedCount = scores.filter(score => score >= passingScore).length;
        return this.calculatePercentage(passedCount, scores.length);
    }

    calculateDifficultyIndex(correctAnswers, totalAttempts) {
        return this.calculatePercentage(correctAnswers, totalAttempts);
    }

    calculateDiscriminationIndex(highGroupCorrect, lowGroupCorrect, groupSize) {
        return ((highGroupCorrect - lowGroupCorrect) / groupSize) * 100;
    }

    // ===== ANALYTICS CALCULATIONS =====

    calculateTrendAnalysis(dataPoints, timeframe = 'week') {
        if (!Array.isArray(dataPoints) || dataPoints.length < 2) {
            return { trend: 'stable', change: 0, direction: 'neutral' };
        }

        const recent = dataPoints.slice(-7); // Last 7 data points
        const previous = dataPoints.slice(-14, -7); // Previous 7 data points

        if (previous.length === 0) {
            return { trend: 'insufficient_data', change: 0, direction: 'neutral' };
        }

        const recentAvg = this.calculateAverage(recent);
        const previousAvg = this.calculateAverage(previous);
        const change = ((recentAvg - previousAvg) / previousAvg) * 100;

        let trend = 'stable';
        let direction = 'neutral';

        if (Math.abs(change) > 5) {
            trend = change > 0 ? 'improving' : 'declining';
            direction = change > 0 ? 'up' : 'down';
        }

        return {
            trend,
            change: parseFloat(change.toFixed(2)),
            direction,
            recentAverage: recentAvg,
            previousAverage: previousAvg
        };
    }

    calculatePredictiveScore(currentProgress, timeRemaining, historicalData) {
        const progressRate = currentProgress / (100 - timeRemaining);
        const historicalAverage = this.calculateAverage(historicalData.map(d => d.finalScore));
        const timeAdjustment = timeRemaining > 50 ? 1.1 : timeRemaining > 20 ? 1.0 : 0.9;
        
        const predictedScore = (progressRate * historicalAverage * timeAdjustment);
        return Math.min(100, Math.max(0, predictedScore));
    }

    // ===== LEARNING PATTERN CALCULATIONS =====

    calculateLearningVelocity(completedLessons, timeSpent) {
        if (timeSpent === 0) return 0;
        return completedLessons / (timeSpent / 60); // Lessons per hour
    }

    calculateRetentionRate(assessmentScores, timeIntervals) {
        if (assessmentScores.length < 2) return 100;
        
        let totalRetention = 0;
        for (let i = 1; i < assessmentScores.length; i++) {
            const retention = (assessmentScores[i] / assessmentScores[i-1]) * 100;
            totalRetention += Math.min(retention, 100);
        }
        
        return totalRetention / (assessmentScores.length - 1);
    }

    calculateOptimalStudyTime(performanceData) {
        const timeSlots = {};
        
        performanceData.forEach(session => {
            const hour = new Date(session.timestamp).getHours();
            if (!timeSlots[hour]) timeSlots[hour] = [];
            timeSlots[hour].push(session.score);
        });

        let bestHour = 9; // Default
        let bestScore = 0;

        Object.entries(timeSlots).forEach(([hour, scores]) => {
            const avgScore = this.calculateAverage(scores);
            if (avgScore > bestScore) {
                bestScore = avgScore;
                bestHour = parseInt(hour);
            }
        });

        return {
            optimalHour: bestHour,
            averageScore: bestScore,
            recommendation: this.getTimeRecommendation(bestHour)
        };
    }

    getTimeRecommendation(hour) {
        if (hour >= 6 && hour <= 9) return 'Early morning learner - high focus';
        if (hour >= 10 && hour <= 12) return 'Morning learner - good retention';
        if (hour >= 13 && hour <= 15) return 'Afternoon learner - steady progress';
        if (hour >= 16 && hour <= 18) return 'Late afternoon learner - active engagement';
        if (hour >= 19 && hour <= 21) return 'Evening learner - reflective study';
        return 'Night learner - requires attention to sleep schedule';
    }

    // ===== CACHE MANAGEMENT =====

    getCachedResult(key) {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            return cached.value;
        }
        this.cache.delete(key);
        return null;
    }

    setCachedResult(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }

    // ===== UTILITY METHODS =====

    formatNumber(number, precision = this.precision) {
        return parseFloat(number.toFixed(precision));
    }

    formatPercentage(value, total) {
        const percentage = this.calculatePercentage(value, total);
        return `${percentage}%`;
    }

    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    }

    validateInput(value, type = 'number') {
        switch (type) {
            case 'number':
                return !isNaN(value) && isFinite(value);
            case 'percentage':
                return this.validateInput(value) && value >= 0 && value <= 100;
            case 'array':
                return Array.isArray(value) && value.length > 0;
            default:
                return value !== null && value !== undefined;
        }
    }

    // ===== ADVANCED CALCULATIONS =====

    calculateLearningEfficiency(timeSpent, knowledgeGained, difficulty) {
        const baseEfficiency = knowledgeGained / timeSpent;
        const difficultyMultiplier = 1 + (difficulty / 100);
        return baseEfficiency * difficultyMultiplier;
    }

    calculateAdaptiveDifficulty(currentPerformance, targetPerformance, currentDifficulty) {
        const performanceRatio = currentPerformance / targetPerformance;
        let adjustment = 0;

        if (performanceRatio > 1.2) {
            adjustment = 10; // Increase difficulty
        } else if (performanceRatio < 0.8) {
            adjustment = -10; // Decrease difficulty
        }

        return Math.max(10, Math.min(100, currentDifficulty + adjustment));
    }

    calculateConfidenceInterval(values, confidenceLevel = 0.95) {
        const mean = this.calculateAverage(values);
        const stdDev = this.calculateStandardDeviation(values);
        const n = values.length;
        
        // Z-score for 95% confidence
        const zScore = confidenceLevel === 0.95 ? 1.96 : 2.58;
        const marginOfError = zScore * (stdDev / Math.sqrt(n));
        
        return {
            mean,
            lowerBound: mean - marginOfError,
            upperBound: mean + marginOfError,
            marginOfError
        };
    }
}

// Create and export singleton instance
export const mathCalculations = new MathematicalCalculations();

// Make it globally available
window.mathCalculations = mathCalculations;
