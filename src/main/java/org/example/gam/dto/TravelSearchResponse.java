package org.example.gam.dto;

import lombok.Data;

import java.util.List;

@Data
public class TravelSearchResponse {
    private List<Item> items;

    @Data
    public static class Item{
        private String title;
        private String category;
        private String roadAddress;
        private String mapx;
        private String mapy;

        private String link;
        private String bookingUrl;
    }
}
