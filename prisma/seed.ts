/**
 * Seed script — run with: `npm run prisma:seed`
 *
 * Phase 3 will expand this to read content from LongAnhCorp/CONTENT.md and
 * populate products, timeline events, jobs, etc. For now this only creates
 * the bare minimum needed for Phase 1: languages, roles, a super-admin user
 * and core settings.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DEFAULT_ROLE_PERMISSIONS } from '../src/lib/permissions';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

  // 1) Languages
  await db.language.createMany({
    data: [
      { code: 'vi', name: 'Tiếng Việt', flagEmoji: '🇻🇳', isDefault: true, sortOrder: 1 },
      { code: 'en', name: 'English', flagEmoji: '🇬🇧', sortOrder: 2 },
      { code: 'zh', name: '中文', flagEmoji: '🇨🇳', sortOrder: 3 },
    ],
    skipDuplicates: true,
  });

  // 2) Roles
  for (const [name, permissions] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
    await db.role.upsert({
      where: { name },
      update: { permissions },
      create: { name, description: `Default ${name} role`, permissions },
    });
  }

  // 3) Super-admin user
  const superAdminRole = await db.role.findUniqueOrThrow({ where: { name: 'super_admin' } });
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? '[email protected]';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

  await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      fullName: 'Long Anh Admin',
      roleId: superAdminRole.id,
    },
  });

  console.log(`  → Admin login: ${adminEmail} / ${adminPassword}`);

  // 4) Core settings (brand info from CONTENT.md)
  const settings: Array<{
    key: string;
    valueVi: string;
    valueEn: string;
    valueZh: string;
    group: string;
  }> = [
    {
      key: 'site.brand_short',
      valueVi: 'KS LONG ANH',
      valueEn: 'LONG ANH MINERAL',
      valueZh: '龙英矿业',
      group: 'brand',
    },
    {
      key: 'site.company_full',
      valueVi: 'Công ty TNHH KS Long Anh',
      valueEn: 'Long Anh Mineral Co., Ltd',
      valueZh: '龙英矿业有限公司',
      group: 'brand',
    },
    {
      key: 'site.tagline',
      valueVi: 'Bột đá Canxi Cacbonat & Đá tự nhiên Việt Nam',
      valueEn: 'Vietnamese Calcium Carbonate & Natural Stone',
      valueZh: '越南碳酸钙粉与天然石材',
      group: 'brand',
    },
    {
      key: 'contact.phone_main',
      valueVi: '(+84) 912 779 799',
      valueEn: '(+84) 912 779 799',
      valueZh: '(+84) 912 779 799',
      group: 'contact',
    },
    {
      key: 'contact.email_main',
      valueVi: 'info@longanhcorp.com',
      valueEn: 'info@longanhcorp.com',
      valueZh: 'info@longanhcorp.com',
      group: 'contact',
    },
  ];

  for (const s of settings) {
    await db.setting.upsert({
      where: { key: s.key },
      update: { valueVi: s.valueVi, valueEn: s.valueEn, valueZh: s.valueZh, group: s.group },
      create: s,
    });
  }

  console.log('✅ Phase 1 seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
