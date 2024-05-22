package com.example.formaturaaline;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/presents")
public class PresentController {
    private static final Logger logger = Logger.getLogger(PresentController.class.getName());

    @Autowired
    private PresentRepository presentRepository;

    @GetMapping
    public List<Present> getPresents() {
        return presentRepository.findAll();
    }

    @PostMapping
    public Present addPresent(@RequestBody Present present) {
        return presentRepository.save(present);
    }

    @DeleteMapping("/{id}")
    public void deletePresent(@PathVariable Long id) {
        presentRepository.deleteById(id);
    }

    @GetMapping("/{id}")
    public Present getPresent(@PathVariable Long id) {
        return presentRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Present updatePresent(@PathVariable Long id, @RequestBody Present updatedPresent) {
        Optional<Present> optionalPresent = presentRepository.findById(id);
        if (optionalPresent.isPresent()) {
            Present present = optionalPresent.get();
            present.setTitle(updatedPresent.getTitle());
            present.setDescription(updatedPresent.getDescription());
            present.setImageUrl(updatedPresent.getImageUrl());
            present.setValue(updatedPresent.getValue());
            present.setLink(updatedPresent.getLink());
            return presentRepository.save(present);
        } else {
            return null;
        }
    }
}
