import { SpectralService } from './SpectralService';

// Create a SpectralService with database connection
export default (): SpectralService => {
  return new SpectralService();
}
