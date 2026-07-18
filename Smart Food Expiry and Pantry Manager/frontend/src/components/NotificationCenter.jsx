export default function NotificationCenter({
  notifications
}) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
      <h2 className="font-semibold text-lg mb-4">
        Notifications
      </h2>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
          >
            ⚠ {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}