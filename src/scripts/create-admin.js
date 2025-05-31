// scripts/create-admin.js
// Run this with: node scripts/create-admin.js

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'admin@admin.com';
    const password = '1234';
    
    console.log('🔍 Checking if admin already exists...');
    
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });
    
    if (existingAdmin) {
      console.log('👤 Admin already exists with email:', email);
      console.log('🔑 Updating password...');
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update the existing admin
      await prisma.admin.update({
        where: { email },
        data: { password: hashedPassword }
      });
      
      console.log('✅ Admin password updated successfully!');
    } else {
      console.log('👤 Creating new admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new admin
      const newAdmin = await prisma.admin.create({
        data: {
          email,
          password: hashedPassword
        }
      });
      
      console.log('✅ Admin created successfully!');
      console.log('📧 Email:', newAdmin.email);
    }
    
    console.log('🔐 Credentials:');
    console.log('Email: admin@admin.com');
    console.log('Password: 1234');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();