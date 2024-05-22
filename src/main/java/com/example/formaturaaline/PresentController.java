package com.example.formaturaaline;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/presents")
public class PresentController {
    private static final Logger logger = Logger.getLogger(PresentController.class.getName());
    private List<Present> presents = new ArrayList<>();

    @GetMapping
    public List<Present> getPresents() {
        logger.info("Returning " + presents.size() + " presents.");
        return presents;
    }

    @PostMapping
    public Present addPresent(@RequestBody Present present) {
        presents.add(present);
        logger.info("Added present: " + present.getTitle());
        return present;
    }

    @DeleteMapping("/{id}")
    public void deletePresent(@PathVariable int id) {
        presents.removeIf(present -> present.getId() == id);
        logger.info("Deleted present with id: " + id);
    }

    @GetMapping("/{id}")
    public Present getPresent(@PathVariable int id) {
        return presents.stream().filter(present -> present.getId() == id).findFirst().orElse(null);
    }

    @PutMapping("/{id}")
    public Present updatePresent(@PathVariable int id, @RequestBody Present updatedPresent) {
        Optional<Present> optionalPresent = presents.stream().filter(present -> present.getId() == id).findFirst();
        if (optionalPresent.isPresent()) {
            Present present = optionalPresent.get();
            present.setTitle(updatedPresent.getTitle());
            present.setDescription(updatedPresent.getDescription());
            present.setImageUrl(updatedPresent.getImageUrl());
            present.setValue(updatedPresent.getValue());
            present.setLink(updatedPresent.getLink());
            logger.info("Updated present: " + present.getTitle());
            return present;
        } else {
            return null;
        }
    }
}
