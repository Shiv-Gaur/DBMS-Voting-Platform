package com.votingplatform.service;

import com.votingplatform.dto.PollRequest;
import com.votingplatform.entity.Poll;
import com.votingplatform.entity.User;
import com.votingplatform.repository.PollRepository;
import com.votingplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PollService {

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private UserRepository userRepository;

    public Poll createPoll(PollRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Poll poll = new Poll();
        poll.setTitle(request.getTitle());
        poll.setDescription(request.getDescription());
        poll.setStartDate(request.getStartDate());
        poll.setEndDate(request.getEndDate());
        poll.setStatus(Poll.Status.PENDING);
        poll.setCreatedBy(user);

        return pollRepository.save(poll);
    }

    public List<Poll> getAllPolls() {
        return pollRepository.findAll();
    }

    public List<Poll> getActivePolls() {
        return pollRepository.findActivePolls(LocalDateTime.now());
    }

    public Poll getPollById(Long id) {
        return pollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poll not found"));
    }

    public Poll updatePoll(Long id, PollRequest request) {
        Poll poll = getPollById(id);
        poll.setTitle(request.getTitle());
        poll.setDescription(request.getDescription());
        poll.setStartDate(request.getStartDate());
        poll.setEndDate(request.getEndDate());
        return pollRepository.save(poll);
    }

    public void deletePoll(Long id) {
        pollRepository.deleteById(id);
    }
}
