package com.remoteconfig.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.remoteconfig.data.model.ToolbarButton
import com.remoteconfig.data.model.AppToolbar

/**
 * 동적 하단 액션 툴바 컴포넌트
 * Config API에서 받은 toolbar 데이터를 기반으로 동적으로 버튼들을 생성
 */
@Composable
fun DynamicBottomToolbar(
    toolbar: AppToolbar,
    onButtonClick: (String, String) -> Unit = { _, _ -> }
) {
    val context = LocalContext.current
    
    // 툴바 배경색과 텍스트 색상 파싱
    val backgroundColor = parseColor(toolbar.backgroundColor ?: "#FFFFFF")
    val textColor = parseColor(toolbar.textColor ?: "#007AFF")
    val toolbarHeight = (toolbar.height ?: 64).dp
    
    // 하단 툴바 컨테이너
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .height(toolbarHeight),
        color = backgroundColor,
        shadowElevation = 8.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // buttons JSON 배열을 파싱해서 동적으로 버튼 생성
            toolbar.buttons.forEach { button ->
                DynamicToolbarButton(
                    button = button,
                    textColor = textColor,
                    onButtonClick = onButtonClick
                )
            }
        }
    }
}

/**
 * 개별 툴바 버튼 컴포넌트
 */
@Composable
fun DynamicToolbarButton(
    button: ToolbarButton,
    textColor: Color,
    onButtonClick: (String, String) -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .padding(8.dp)
    ) {
        // 아이콘 버튼
        IconButton(
            onClick = { 
                onButtonClick(button.id, button.action)
            },
            modifier = Modifier.size(40.dp)
        ) {
            Icon(
                imageVector = getIconFromString(button.icon),
                contentDescription = button.title,
                tint = textColor,
                modifier = Modifier.size(24.dp)
            )
        }
        
        // 버튼 제목
        Text(
            text = button.title,
            color = textColor,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium
        )
    }
}

/**
 * 아이콘 문자열을 Material Icons로 변환
 */
fun getIconFromString(iconName: String): ImageVector {
    return when (iconName.lowercase()) {
        "plus", "add" -> Icons.Default.Add
        "share" -> Icons.Default.Share
        "heart", "favorite" -> Icons.Default.Favorite
        "home" -> Icons.Default.Home
        "user", "person" -> Icons.Default.Person
        "settings" -> Icons.Default.Settings
        "help", "help-circle" -> Icons.Default.Help
        "search" -> Icons.Default.Search
        "menu" -> Icons.Default.Menu
        "edit" -> Icons.Default.Edit
        "delete" -> Icons.Default.Delete
        "download" -> Icons.Default.Download
        "upload" -> Icons.Default.Upload
        "camera" -> Icons.Default.CameraAlt
        "gallery", "image" -> Icons.Default.Image
        "location" -> Icons.Default.LocationOn
        "notification", "bell" -> Icons.Default.Notifications
        "star" -> Icons.Default.Star
        "bookmark" -> Icons.Default.Bookmark
        "refresh" -> Icons.Default.Refresh
        "close" -> Icons.Default.Close
        "check" -> Icons.Default.Check
        "arrow-back", "back" -> Icons.Default.ArrowBack
        "arrow-forward", "forward" -> Icons.Default.ArrowForward
        "more" -> Icons.Default.MoreVert
        else -> Icons.Default.Circle // 기본 아이콘
    }
}

/**
 * 색상 문자열을 Color 객체로 변환
 */
fun parseColor(colorString: String): Color {
    return try {
        if (colorString.startsWith("#")) {
            Color(android.graphics.Color.parseColor(colorString))
        } else {
            Color.Gray // 기본 색상
        }
    } catch (e: Exception) {
        Color.Gray // 파싱 실패 시 기본 색상
    }
}

/**
 * 툴바 버튼 액션 처리 함수
 */
fun handleToolbarAction(
    context: android.content.Context,
    buttonId: String,
    action: String
) {
    when (action) {
        "create_item" -> {
            // 새 항목 생성 액션
            android.widget.Toast.makeText(context, "새 항목을 생성합니다", android.widget.Toast.LENGTH_SHORT).show()
            // 실제 구현: 새 항목 생성 화면으로 이동
        }
        "share_content" -> {
            // 공유 액션
            android.widget.Toast.makeText(context, "콘텐츠를 공유합니다", android.widget.Toast.LENGTH_SHORT).show()
            // 실제 구현: 공유 인텐트 실행
        }
        "toggle_favorite" -> {
            // 즐겨찾기 토글 액션
            android.widget.Toast.makeText(context, "즐겨찾기를 토글합니다", android.widget.Toast.LENGTH_SHORT).show()
            // 실제 구현: 즐겨찾기 상태 변경
        }
        else -> {
            // 기본 액션
            android.widget.Toast.makeText(context, "$buttonId 버튼이 클릭되었습니다", android.widget.Toast.LENGTH_SHORT).show()
        }
    }
}

/**
 * 사용 예시 컴포넌트
 */
@Composable
fun BottomToolbarExample(toolbar: AppToolbar) {
    val context = LocalContext.current
    
    DynamicBottomToolbar(
        toolbar = toolbar,
        onButtonClick = { buttonId, action ->
            handleToolbarAction(context, buttonId, action)
        }
    )
} 