// ===== COMMUNICATION MODULE (MODULAR) =====

import { CommunicationManager as ModularCommunicationManager } from './communication/communication-manager.js';

// Re-export the modular communication manager
export class CommunicationManager extends ModularCommunicationManager {
    constructor() {
        super();
        console.log('🔄 Using modular Communication Manager');
    }
}

// Create and export singleton instance
export const communicationManager = new CommunicationManager();

// Make it globally available for onclick handlers
window.communicationManager = communicationManager;