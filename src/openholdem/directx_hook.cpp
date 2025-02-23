#include <Windows.h>
#include <iostream>

#define EXPORT __declspec(dllexport)

typedef struct {
    char cards[2][3];  // Hole cards
    char board[5][3];  // Community cards
    double pot;
    double stack;
} GameState;

// Placeholder - actual implementation requires DirectX hooking
EXPORT void update_strategy(const char* strategy_path) {
    std::cout << "Updating strategy from: " << strategy_path << std::endl;
}

EXPORT void execute_action(int action, double amount) {
    std::cout << "Executing action: " << action << " with amount: " << amount << std::endl;
}
