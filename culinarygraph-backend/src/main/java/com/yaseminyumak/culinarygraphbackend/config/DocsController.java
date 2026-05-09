package com.yaseminyumak.culinarygraphbackend.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DocsController {

    @GetMapping("/docs")
    public String docs() {
        return "forward:/docs.html";
    }
}
