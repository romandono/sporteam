import bcrypt from 'bcrypt';
import { connectDB, disconnectDB, cleanDB, prisma } from './helpers';
import * as profileService from '../services/profileService';
import { ProfileType } from '../generated/prisma/enums';

describe('profileService - CRUD', () => {
  beforeAll(async () => { await connectDB(); });
  afterAll(async () => { await disconnectDB(); });
  afterEach(async () => { await cleanDB(); });

  // ─── JUGADOR ─────────────────────────────────────────────────────────────

  describe('JUGADOR', () => {
    it('createProfile - debe crear user + perfil JUGADOR', async () => {
      const profile = await profileService.createProfile({
        profileType: ProfileType.JUGADOR,
        nombre: 'Juan', apellidos: 'Perez',
        email: 'juan@test.com', password: 'pass123',
        role: 'JUGADOR_ROLE',
        nombreDeportivo: 'Juanito',
        demarcacion: ['Delantero'],
        altura: 180, peso: 75
      });

      expect(profile.id).toBeDefined();
      expect(profile.profileType).toBe(ProfileType.JUGADOR);
      expect(profile.nombreDeportivo).toBe('Juanito');
      expect(profile.demarcacion).toEqual(['Delantero']);
      expect(profile.user).toBeDefined();
      expect(profile.user.email).toBe('juan@test.com');
      expect(profile.user.role).toBe('JUGADOR_ROLE');
    });

    it('getProfiles - debe listar solo perfiles JUGADOR con paginacion', async () => {
      // Create 2 jugadores and 1 entrenador
      await profileService.createProfile({
        profileType: ProfileType.JUGADOR,
        nombre: 'A', apellidos: 'Uno', email: 'a@test.com',
        password: 'pass', role: 'JUGADOR_ROLE'
      });
      await profileService.createProfile({
        profileType: ProfileType.JUGADOR,
        nombre: 'B', apellidos: 'Dos', email: 'b@test.com',
        password: 'pass', role: 'JUGADOR_ROLE'
      });
      await profileService.createProfile({
        profileType: ProfileType.ENTRENADOR,
        nombre: 'C', apellidos: 'Tres', email: 'c@test.com',
        password: 'pass', role: 'ENTRENADOR_ROLE'
      });

      const { profiles, total } = await profileService.getProfiles(ProfileType.JUGADOR);
      expect(total).toBe(2);
      expect(profiles).toHaveLength(2);
      profiles.forEach(p => expect(p.profileType).toBe(ProfileType.JUGADOR));
    });

    it('getProfiles - paginacion: desde y limite', async () => {
      for (let i = 0; i < 5; i++) {
        await profileService.createProfile({
          profileType: ProfileType.JUGADOR,
          nombre: `Jug${i}`, apellidos: 'Test',
          email: `jug${i}@test.com`, password: 'pass',
          role: 'JUGADOR_ROLE'
        });
      }

      const { profiles, total } = await profileService.getProfiles(ProfileType.JUGADOR, { desde: 0, limite: 2 });
      expect(total).toBe(5);
      expect(profiles).toHaveLength(2);
    });

    it('getProfileByUserId - debe encontrar perfil por user id + type', async () => {
      const created = await profileService.createProfile({
        profileType: ProfileType.JUGADOR,
        nombre: 'Juan', apellidos: 'Perez',
        email: 'juan2@test.com', password: 'pass',
        role: 'JUGADOR_ROLE'
      });

      const found = await profileService.getProfileByUserId(created.userId, ProfileType.JUGADOR);
      expect(found.id).toBe(created.id);
      expect(found.user.email).toBe('juan2@test.com');
    });

    it('getProfileByUserId - debe lanzar 404 si no existe', async () => {
      await expect(
        profileService.getProfileByUserId('nonexistent', ProfileType.JUGADOR)
      ).rejects.toThrow('Perfil no encontrado');
    });

    it('getProfileById - debe encontrar perfil por profile id', async () => {
      const created = await profileService.createProfile({
        profileType: ProfileType.JUGADOR,
        nombre: 'PorId', apellidos: 'Test',
        email: 'porid@test.com', password: 'pass',
        role: 'JUGADOR_ROLE'
      });

      const found = await profileService.getProfileById(created.id, true);
      expect(found.id).toBe(created.id);
      expect(found.user.email).toBe('porid@test.com');
    });

    it('searchProfiles - debe buscar por nombre de usuario', async () => {
      await profileService.createProfile({
        profileType: ProfileType.JUGADOR,
        nombre: 'Carlos', apellidos: 'Garcia',
        email: 'carlos@test.com', password: 'pass',
        role: 'JUGADOR_ROLE'
      });

      const results = await profileService.searchProfiles(ProfileType.JUGADOR, 'carl');
      expect(results).toHaveLength(1);
      expect(results[0].user.nombre).toBe('Carlos');
    });

    it('updateProfile - debe actualizar campos de user y profile', async () => {
      const created = await profileService.createProfile({
        profileType: ProfileType.JUGADOR,
        nombre: 'Viejo', apellidos: 'Nombre',
        email: 'viejo@test.com', password: 'pass',
        role: 'JUGADOR_ROLE',
        nombreDeportivo: 'Viejito'
      });

      const updated = await profileService.updateProfile(created.id, {
        nombre: 'Nuevo',
        nombreDeportivo: 'Nuevito',
        altura: 190
      });

      expect(updated.user.nombre).toBe('Nuevo');
      expect(updated.nombreDeportivo).toBe('Nuevito');
      expect(Number(updated.altura)).toBe(190);
    });

    it('deleteProfile - debe eliminar el perfil', async () => {
      const created = await profileService.createProfile({
        profileType: ProfileType.JUGADOR,
        nombre: 'Delete', apellidos: 'Me',
        email: 'delete@test.com', password: 'pass',
        role: 'JUGADOR_ROLE'
      });

      await profileService.deleteProfile(created.id);

      await expect(
        profileService.getProfileById(created.id)
      ).rejects.toThrow('Perfil no encontrado');
    });

    it('getProfilesByZona - debe filtrar por zona', async () => {
      // Create zona
      const zona = await prisma.zona.create({ data: { nombreZona: 'TestZona' } });

      const created = await profileService.createProfile({
        profileType: ProfileType.JUGADOR,
        nombre: 'Zona', apellidos: 'Test',
        email: 'zona@test.com', password: 'pass',
        role: 'JUGADOR_ROLE',
        zonas: [zona.id]
      });

      const { profiles, total } = await profileService.getProfilesByZona(ProfileType.JUGADOR, zona.id);
      expect(total).toBe(1);
      expect(profiles[0].id).toBe(created.id);
    });
  });

  // ─── ENTRENADOR ───────────────────────────────────────────────────────────

  describe('ENTRENADOR', () => {
    it('createProfile - debe crear user + perfil ENTRENADOR', async () => {
      const profile = await profileService.createProfile({
        profileType: ProfileType.ENTRENADOR,
        nombre: 'Coach', apellidos: 'Tactico',
        email: 'coach@test.com', password: 'pass123',
        role: 'ENTRENADOR_ROLE',
        nombreDeportivo: 'El Coach',
        entrenadorPorteros: true,
        titulacion: ['Nivel 1', 'Nivel 2'],
        telefono: '123456789'
      });

      expect(profile.id).toBeDefined();
      expect(profile.profileType).toBe(ProfileType.ENTRENADOR);
      expect(profile.nombreDeportivo).toBe('El Coach');
      expect(profile.entrenadorPorteros).toBe(true);
      expect(profile.titulacion).toEqual(['Nivel 1', 'Nivel 2']);
      expect(profile.telefono).toBe('123456789');
      expect(profile.user.role).toBe('ENTRENADOR_ROLE');
    });

    it('getProfiles - onlyActive filtra usuarios inactivos', async () => {
      const user = await prisma.user.create({
        data: {
          nombre: 'Inactivo', apellidos: 'Test',
          email: 'inactivo@test.com',
          password: bcrypt.hashSync('pass', 10),
          role: 'ENTRENADOR_ROLE',
          estado: false,
          perfiles: { create: { profileType: ProfileType.ENTRENADOR } }
        }
      });

      const { profiles, total } = await profileService.getProfiles(
        ProfileType.ENTRENADOR, { onlyActive: true }
      );
      expect(profiles).toHaveLength(0);
      expect(total).toBe(0);
    });
  });

  // ─── MULTI-PROFILE ────────────────────────────────────────────────────────

  describe('Multi-profile', () => {
    it('un usuario puede tener 2 perfiles (JUGADOR + ENTRENADOR)', async () => {
      const user = await prisma.user.create({
        data: {
          nombre: 'Multi', apellidos: 'Perfil',
          email: 'multi@test.com',
          password: bcrypt.hashSync('pass', 10),
          role: 'USER_ROLE',
          perfiles: {
            create: [
              { profileType: ProfileType.JUGADOR, nombreDeportivo: 'Futbolista' },
              { profileType: ProfileType.ENTRENADOR, nombreDeportivo: 'Coach' }
            ]
          }
        },
        include: { perfiles: true }
      });

      expect(user.perfiles).toHaveLength(2);
      expect(user.perfiles[0].profileType).toBe(ProfileType.JUGADOR);
      expect(user.perfiles[1].profileType).toBe(ProfileType.ENTRENADOR);

      // CRUD independiente: eliminar un perfil no afecta al otro
      await prisma.profile.delete({ where: { id: user.perfiles[0].id } });

      const remaining = await prisma.profile.findMany({ where: { userId: user.id } });
      expect(remaining).toHaveLength(1);
      expect(remaining[0].profileType).toBe(ProfileType.ENTRENADOR);
    });
  });
});