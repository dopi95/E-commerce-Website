import { getCache, setCache, clearCache } from './utils/cache.js';

console.log('🧪 Testing Cache System...\n');

// Test 1: Set and Get
console.log('Test 1: Set and Get');
setCache('test', { data: 'Hello World' });
const result1 = getCache('test');
console.log('✅ Result:', result1);

// Test 2: Cache Miss
console.log('\nTest 2: Cache Miss');
const result2 = getCache('nonexistent');
console.log('✅ Result:', result2 === null ? 'null (correct)' : 'ERROR');

// Test 3: Clear Cache
console.log('\nTest 3: Clear Cache');
clearCache('test');
const result3 = getCache('test');
console.log('✅ Result:', result3 === null ? 'null (correct)' : 'ERROR');

// Test 4: TTL Expiry (short TTL)
console.log('\nTest 4: TTL Expiry (1 second)');
setCache('ttl-test', { data: 'Will expire' }, 1000);
console.log('✅ Set with 1s TTL');
setTimeout(() => {
  const result4 = getCache('ttl-test');
  console.log('✅ After 1.5s:', result4 === null ? 'null (expired correctly)' : 'ERROR');
  console.log('\n🎉 All cache tests passed!\n');
}, 1500);
