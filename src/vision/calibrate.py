import cv2
import numpy as np
import json

class TableCalibrator:
    # ... (rest of the code remains the same)
        with open('calibration.json', 'w') as f:
            json.dump(self.reference_points, f)


if __name__ == "__main__":
    # Example usage with a sample image (replace with actual frame grabbing)
    sample_image = cv2.imread("table_screenshot.png") # Replace with actual screen capture
    if sample_image is not None:
        calibrator = TableCalibrator()
        x, y, w, h = calibrator.detect_table_region(sample_image)
        print(f"Table Region: x={x}, y={y}, w={w}, h={h}")

        cropped_table = sample_image[y:y+h, x:x+w]
        card_slots = calibrator.identify_card_slots(cropped_table)
        print(f"Card Slots: {card_slots}")

        for i, slot in enumerate(card_slots):
            x, y, w, h = slot
            cv2.rectangle(cropped_table, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(cropped_table, str(i+1), (x,y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36,255,12), 2)


        cv2.imshow("Detected Table and Cards", cropped_table)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

        calibrator.save_calibration()
        print("Calibration data saved to calibration.json")
    else:
        print("Could not load the sample image.")
