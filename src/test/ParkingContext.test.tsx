import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ParkingProvider, useParkingContext } from "../context/ParkingContext";
import { NotificationProvider } from "../context/NotificationContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NotificationProvider>
    <ParkingProvider>{children}</ParkingProvider>
  </NotificationProvider>
);

describe("Parking System Tests", () => {
  it("should initialize with 15 spots", () => {
    const { result } = renderHook(() => useParkingContext(), { wrapper });
    expect(result.current.spots).toHaveLength(15);
  });

  it("should park a vehicle", () => {
    const { result } = renderHook(() => useParkingContext(), { wrapper });

    act(() => {
      result.current.occupySpot("B1-01", "ABC-1234", "car");
    });

    const spot = result.current.spots.find((s) => s.id === "B1-01");
    expect(spot?.status).toBe("occupied");
    expect(spot?.vehicle?.licensePlate).toBe("ABC-1234");
  });

  it("should exit a vehicle and add to history", () => {
    const { result } = renderHook(() => useParkingContext(), { wrapper });

    act(() => {
      result.current.occupySpot("B1-01", "XYZ-5678", "car");
    });

    act(() => {
      result.current.vacateSpot("B1-01");
    });

    const spot = result.current.spots.find((s) => s.id === "B1-01");
    expect(spot?.status).toBe("available");
    expect(result.current.parkingHistory.length).toBeGreaterThan(0);
  });

  it("should switch floors", () => {
    const { result } = renderHook(() => useParkingContext(), { wrapper });

    act(() => {
      result.current.setSelectedFloor("B2");
    });

    expect(result.current.selectedFloor).toBe("B2");
  });
});
