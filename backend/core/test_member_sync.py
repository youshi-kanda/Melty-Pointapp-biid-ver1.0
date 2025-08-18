from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
import json

User = get_user_model()


class MemberSyncAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            member_id='admin001'
        )
        self.client.force_authenticate(user=self.admin_user)
        
    def test_create_new_member(self):
        """Test creating a new member via sync endpoint"""
        member_data = {
            'member_id': 'test001',
            'username': 'testuser',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'points': 100,
            'status': 'active',
            'location': 'Tokyo',
            'avatar': 'https://example.com/avatar.jpg'
        }
        
        response = self.client.post('/api/extern/members/', member_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertTrue(response.data['created'])
        self.assertEqual(response.data['message'], 'Member created successfully')
        
        user = User.objects.get(member_id='test001')
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.points, 100)
        
    def test_update_existing_member(self):
        """Test updating an existing member via sync endpoint"""
        existing_user = User.objects.create_user(
            username='existing',
            email='existing@test.com',
            member_id='existing001',
            points=50
        )
        
        update_data = {
            'member_id': 'existing001',
            'username': 'updated_user',
            'email': 'updated@example.com',
            'points': 200,
            'status': 'active'
        }
        
        response = self.client.post('/api/extern/members/', update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertFalse(response.data['created'])
        self.assertEqual(response.data['message'], 'Member updated successfully')
        
        existing_user.refresh_from_db()
        self.assertEqual(existing_user.username, 'updated_user')
        self.assertEqual(existing_user.email, 'updated@example.com')
        self.assertEqual(existing_user.points, 200)
        
    def test_missing_required_fields(self):
        """Test validation with missing required fields"""
        incomplete_data = {
            'username': 'testuser'
        }
        
        response = self.client.post('/api/extern/members/', incomplete_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('errors', response.data)
        
    def test_authentication_required(self):
        """Test that authentication is required for the endpoint"""
        self.client.force_authenticate(user=None)
        
        member_data = {
            'member_id': 'test001',
            'username': 'testuser',
            'email': 'test@example.com'
        }
        
        response = self.client.post('/api/extern/members/', member_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
