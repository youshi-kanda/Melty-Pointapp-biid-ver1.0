from django.test import TestCase
from django.contrib.auth import get_user_model
from core.models import Store, PointTransaction

User = get_user_model()


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            member_id='M12345',
            points=1000
        )

    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.member_id, 'M12345')
        self.assertEqual(self.user.points, 1000)
        self.assertEqual(self.user.status, 'active')

    def test_user_str_representation(self):
        expected = f"testuser (M12345)"
        self.assertEqual(str(self.user), expected)


class StoreModelTest(TestCase):
    def setUp(self):
        self.store = Store.objects.create(
            name='Test Store',
            owner_name='Test Owner',
            email='store@example.com',
            phone='03-1234-5678',
            address='Test Address',
            point_rate=5
        )

    def test_store_creation(self):
        self.assertEqual(self.store.name, 'Test Store')
        self.assertEqual(self.store.owner_name, 'Test Owner')
        self.assertEqual(self.store.email, 'store@example.com')
        self.assertEqual(self.store.point_rate, 5)
        self.assertEqual(self.store.status, 'active')

    def test_store_str_representation(self):
        self.assertEqual(str(self.store), 'Test Store')


class PointTransactionModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            member_id='M12345'
        )
        self.store = Store.objects.create(
            name='Test Store',
            owner_name='Test Owner',
            email='store@example.com',
            phone='03-1234-5678',
            address='Test Address'
        )
        self.transaction = PointTransaction.objects.create(
            user=self.user,
            store=self.store,
            transaction_id='TXN001',
            amount=1000.00,
            points_issued=100,
            payment_method='credit'
        )

    def test_transaction_creation(self):
        self.assertEqual(self.transaction.user, self.user)
        self.assertEqual(self.transaction.store, self.store)
        self.assertEqual(self.transaction.transaction_id, 'TXN001')
        self.assertEqual(self.transaction.amount, 1000.00)
        self.assertEqual(self.transaction.points_issued, 100)
        self.assertEqual(self.transaction.status, 'completed')

    def test_transaction_str_representation(self):
        expected = f"TXN001 - testuser - 100 points"
        self.assertEqual(str(self.transaction), expected)

    def test_transaction_relationships(self):
        self.assertEqual(self.user.point_transactions.count(), 1)
        self.assertEqual(self.store.point_transactions.count(), 1)
