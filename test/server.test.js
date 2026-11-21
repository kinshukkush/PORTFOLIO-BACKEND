import test from 'node:test';
import assert from 'node:assert/strict';
import { contactInput, escapeHtml } from '../server.js';

test('contact input normalizes valid submissions', () => {
  const parsed = contactInput.parse({
    name: '  Kinshuk Saxena  ',
    email: 'KINSHUK@EXAMPLE.COM',
    subject: '  New project  ',
    message: '  I would like to discuss a portfolio project.  ',
  });

  assert.equal(parsed.name, 'Kinshuk Saxena');
  assert.equal(parsed.email, 'kinshuk@example.com');
  assert.equal(parsed.subject, 'New project');
});

test('contact input rejects short and unexpected content', () => {
  const parsed = contactInput.safeParse({
    name: 'K',
    email: 'not-an-email',
    message: 'short',
    admin: true,
  });

  assert.equal(parsed.success, false);
});

test('email template values are escaped', () => {
  assert.equal(
    escapeHtml('<script>alert("x")</script>'),
    '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;',
  );
});
