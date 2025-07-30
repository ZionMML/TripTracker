using API.DTOs;
using Api.Interfaces;
using Api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripsController(ITripRepository tripRepository, IMapper _mapper) : ControllerBase
    {
        private readonly ITripRepository _tripRepository = tripRepository;

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<TripDto>>> GetTrips(string userId)
        {
            var trips = await _tripRepository.GetTripsByUserIdAsync(userId);

            if (trips == null || !trips.Any())
                return BadRequest("No trips found for this user");

            var tripDtos = _mapper.Map<IEnumerable<TripDto>>(trips);
            return Ok(tripDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TripDto>> GetTrip(int id)
        {
            var trip = await _tripRepository.GetTripByIdAsync(id);

            if (trip == null)
                return BadRequest("Could not find trip");

            return Ok(_mapper.Map<TripDto>(trip));
        }

        [HttpPost]
        public async Task<ActionResult<TripDto>> CreateTrip([FromBody] CreateTripDto createTripDto)
        {
            var trip = _mapper.Map<Trip>(createTripDto);

            await _tripRepository.AddTripAsync(trip);

            if (!await _tripRepository.SaveAllAsync())
                return BadRequest("Failed to create trip");

            var tripDto = _mapper.Map<TripDto>(trip);

            return CreatedAtAction(nameof(GetTrip), new { id = trip.Id }, tripDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTrip(int id, [FromBody] UpdateTripDto updateTripDto)
        {
            var trip = await _tripRepository.GetTripByIdAsync(id);

            if (trip == null)
                return BadRequest("Could not find trip");

            _mapper.Map(updateTripDto, trip);
            _tripRepository.UpdateTrip(trip);

            if (!await _tripRepository.SaveAllAsync())
                return BadRequest("Failed to update trip");

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            var trip = await _tripRepository.GetTripByIdAsync(id);

            if (trip == null)
                return BadRequest("Could not find trip");

            _tripRepository.DeleteTrip(trip);

            if (!await _tripRepository.SaveAllAsync())
                return BadRequest("Failed to delete trip");

            return NoContent();
        }
    }
}
