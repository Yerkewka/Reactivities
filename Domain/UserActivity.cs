using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain
{
    public class UserActivity
    {
        public string AppUserId { get; set; }
        [ForeignKey((nameof(AppUserId)))]
        public virtual AppUser AppUser { get; set; }

        public Guid ActivityId { get; set; }
        [ForeignKey(nameof(ActivityId))]
        public virtual Activity Activity { get; set; }

        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }
    }
}