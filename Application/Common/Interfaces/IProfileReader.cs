using System.Threading.Tasks;
using Application.Profiles;

namespace Application.Common.Interfaces
{
    public interface IProfileReader
    {
        Task<Profile> ReadProfile(string username);
    }
}