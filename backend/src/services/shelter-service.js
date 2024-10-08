const ShelterRepository = require('../repository/shelter-repository');

class ShelterService {
    constructor() {
        this.shelterRepo = new ShelterRepository();
    }

    async createShelter(data) {
        try {
            return await this.shelterRepo.create(data);
        } catch (error) {
            console.error("Error in ShelterService.createShelter", error);
            throw error;
        }
    }

    async getShelter(id) {
        try {
            return await this.shelterRepo.get(id);
        } catch (error) {
            console.error("Error in ShelterService.getShelter", error);
            throw error;
        }
    }

    async getAllShelters() {
        try {
            return await this.shelterRepo.getAllShelters();
        } catch (error) {
            console.error("Error in ShelterService.getAllShelters", error);
            throw error;
        }
    }

    async updateShelter(id, data) {
        try {
            return await this.shelterRepo.update(id, data);
        } catch (error) {
            console.error("Error in ShelterService.updateShelter", error);
            throw error;
        }
    }

    async deleteShelter(id) {
        try {
            const shelter = await this.shelterRepo.get(id);
            if (!shelter) {
                throw new Error('Shelter not found');
            }
            await this.shelterRepo.delete(id);
            return { message: 'Shelter deleted successfully' };
        } catch (error) {
            console.error("Error in ShelterService.deleteShelter", error);
            throw error;
        }
    }

    async joinShelterAsOrganization(shelterId, orgId, peopleCount) {
        try {
            return await this.shelterRepo.joinShelterAsOrganization(shelterId, orgId, peopleCount);
        } catch (error) {
            console.error("Error in ShelterService.joinShelterAsOrganization", error);
            throw error;
        }
    }

    async joinShelterAsUser(shelterId, userId) {
        try {
            return await this.shelterRepo.joinShelterAsUser(shelterId, userId);
        } catch (error) {
            console.error("Error in ShelterService.joinShelterAsUser", error);
            throw error;
        }
    }

    async quitShelterAsOrganization(shelterId, orgId) {
        try {
            return await this.shelterRepo.quitShelterAsOrganization(shelterId, orgId);
        } catch (error) {
            console.error("Error in ShelterService.quitShelterAsOrganization", error);
            throw error;
        }
    }

    async quitShelterAsUser(shelterId, userId) {
        try {
            return await this.shelterRepo.quitShelterAsUser(shelterId, userId);
        } catch (error) {
            console.error("Error in ShelterService.quitShelterAsUser", error);
            throw error;
        }
    }
}

module.exports = ShelterService;
